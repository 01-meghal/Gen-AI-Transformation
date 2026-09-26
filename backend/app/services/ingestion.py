import re
import ipaddress
from urllib.parse import urlparse
from typing import Tuple, List, Dict, Any, Optional
import httpx
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from app.models import Source, Block, Chunk, Claim

# SSRF Defense function
def is_safe_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = parsed.hostname
        if not hostname:
            return False
        # Prevent localhost / private network ranges
        if hostname.lower() in ("localhost", "127.0.0.1", "0.0.0.0", "::1"):
            return False
        try:
            ip = ipaddress.ip_address(hostname)
            if ip.is_private or ip.is_loopback or ip.is_link_local:
                return False
        except ValueError:
            pass  # Normal hostname, e.g. example.com
        return True
    except Exception:
        return False

class IngestionService:
    @staticmethod
    def extract_text_from_file(file_content: bytes, filename: str, source_type: str) -> str:
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        
        if source_type in ("pdf",) or ext == "pdf":
            try:
                import io, pypdf
                reader = pypdf.PdfReader(io.BytesIO(file_content))
                extracted = []
                for page in reader.pages:
                    txt = page.extract_text()
                    if txt:
                        extracted.append(txt)
                if extracted:
                    return "\n\n".join(extracted)
            except Exception as e:
                print(f"pypdf extraction error: {e}")

        if source_type in ("docx",) or ext == "docx":
            try:
                import io, docx
                doc = docx.Document(io.BytesIO(file_content))
                extracted = [p.text for p in doc.paragraphs if p.text.strip()]
                if extracted:
                    return "\n\n".join(extracted)
            except Exception as e:
                print(f"docx extraction error: {e}")

        # Default fallback to UTF-8 text decoding
        try:
            return file_content.decode("utf-8")
        except Exception:
            return file_content.decode("latin-1", errors="ignore")

    @staticmethod
    async def extract_text_from_url(url: str) -> str:
        if not is_safe_url(url):
            raise ValueError("Invalid or restricted URL provided for security compliance (SSRF protection).")
        
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "GenAI-Content-Transformer/1.0"})
            resp.raise_for_status()
            
            soup = BeautifulSoup(resp.text, "html.parser")
            # Remove scripts, styles, headers, footers
            for elem in soup(["script", "style", "nav", "header", "footer", "form"]):
                elem.decompose()
            
            text = soup.get_text(separator="\n")
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            clean_text = "\n".join(chunk for chunk in chunks if chunk)
            return clean_text

    @staticmethod
    def process_source_content(db: Session, source: Source, raw_text: str):
        source.content = raw_text
        words = raw_text.split()
        source.word_count = len(words)
        
        # 1. Break into logical Blocks (paragraphs/sections)
        paragraphs = [p.strip() for p in raw_text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [p.strip() for p in raw_text.split("\n") if p.strip()]
            
        blocks = []
        for idx, para in enumerate(paragraphs):
            block_type = "paragraph"
            if len(para) < 80 and not para.endswith("."):
                block_type = "heading"
            block = Block(
                source_id=source.id,
                block_index=idx,
                content=para,
                block_type=block_type
            )
            db.add(block)
            blocks.append(block)
        db.flush()

        # 2. Break into Chunks (~500 chars with overlap)
        chunks = []
        chunk_size = 600
        overlap = 100
        chunk_idx = 0
        
        for block in blocks:
            text = block.content
            start = 0
            while start < len(text):
                end = start + chunk_size
                chunk_str = text[start:end]
                chunk = Chunk(
                    source_id=source.id,
                    block_id=block.id,
                    chunk_index=chunk_idx,
                    content=chunk_str,
                    chunk_metadata=f'{{"start_offset": {start}, "end_offset": {start+len(chunk_str)}}}'
                )
                db.add(chunk)
                chunks.append(chunk)
                chunk_idx += 1
                start += chunk_size - overlap
                if len(chunk_str) < chunk_size:
                    break
        
        source.chunk_count = len(chunks)

        # 3. Extract key claims & facts (Rule/Heuristic extraction)
        sentences = re.split(r'(?<=[.!?]) +', raw_text)
        claim_idx = 0
        for sent in sentences:
            sent_clean = sent.strip()
            # If sentence contains statistics, key numbers, or definitive statements
            if len(sent_clean) > 20 and (re.search(r'\d+%', sent_clean) or re.search(r'\$\d+', sent_clean) or any(k in sent_clean.lower() for k in ["must", "key", "critical", "result", "found", "discovered", "growth", "increased"])):
                claim_type = "statistic" if ("%" in sent_clean or "$" in sent_clean) else "fact"
                claim = Claim(
                    source_id=source.id,
                    claim_text=sent_clean,
                    claim_type=claim_type,
                    importance=4 if claim_type == "statistic" else 3,
                    confidence=0.95,
                    evidence=f'{{"evidence_id": "ev_{claim_idx+1}", "quote": "{sent_clean[:100]}"}}'
                )
                db.add(claim)
                claim_idx += 1
                if claim_idx >= 10:
                    break

        source.status = "ready"
        db.commit()
        db.refresh(source)
        return source
