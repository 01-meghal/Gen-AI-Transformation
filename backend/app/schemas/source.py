from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class BlockSchema(BaseModel):
    id: int
    block_index: int
    content: str
    block_type: Optional[str] = None
    block_metadata: Optional[str] = None

    class Config:
        from_attributes = True

class ChunkSchema(BaseModel):
    id: int
    chunk_index: int
    content: str
    chunk_metadata: Optional[str] = None

    class Config:
        from_attributes = True

class ClaimSchema(BaseModel):
    id: int
    claim_text: str
    claim_type: str
    importance: int
    confidence: float
    evidence: Optional[str] = None

    class Config:
        from_attributes = True

class SourceBase(BaseModel):
    filename: str
    original_filename: str
    file_size: Optional[int] = None
    content_type: Optional[str] = None
    source_type: str  # text, txt, md, pdf, docx, url
    status: str = "processing"      # created, processing, ready, failed, deleted
    content: Optional[str] = None
    object_key: Optional[str] = None
    language: Optional[str] = "en"
    word_count: Optional[int] = 0
    chunk_count: Optional[int] = 0
    project_id: int
    workspace_id: int

class SourceCreateText(BaseModel):
    title: str
    text: str
    project_id: int
    workspace_id: int

class SourceCreateUrl(BaseModel):
    url: str
    title: Optional[str] = None
    project_id: int
    workspace_id: int

class SourceCreate(SourceBase):
    uploader_id: int

class SourceUpdate(BaseModel):
    filename: Optional[str] = None
    status: Optional[str] = None
    content: Optional[str] = None
    language: Optional[str] = None
    word_count: Optional[int] = None
    chunk_count: Optional[int] = None

class Source(SourceBase):
    id: int
    uploader_id: int
    created_at: Optional[datetime] = None
    blocks: Optional[List[BlockSchema]] = []
    chunks: Optional[List[ChunkSchema]] = []
    claims: Optional[List[ClaimSchema]] = []

    class Config:
        from_attributes = True
