from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import Source, Block, Chunk, Claim
from app.schemas import source as source_schema
from app.services.ingestion import IngestionService
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.post("/text", response_model=source_schema.Source, status_code=status.HTTP_201_CREATED)
def create_text_source(
    data: source_schema.SourceCreateText,
    db: Session = Depends(get_db)
):
    user_obj, workspace_obj, project_obj = ensure_default_data(db)
    proj_id = data.project_id or project_obj.id
    ws_id = data.workspace_id or workspace_obj.id

    db_source = Source(
        filename=data.title if data.title.endswith(".txt") else f"{data.title}.txt",
        original_filename=data.title,
        file_size=len(data.text.encode("utf-8")),
        content_type="text/plain",
        source_type="text",
        status="processing",
        project_id=proj_id,
        workspace_id=ws_id,
        uploader_id=user_obj.id
    )
    db.add(db_source)
    db.commit()
    db.refresh(db_source)

    IngestionService.process_source_content(db, db_source, data.text)
    return db_source

@router.post("/upload", response_model=source_schema.Source, status_code=status.HTTP_201_CREATED)
async def upload_file_source(
    file: UploadFile = File(...),
    project_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    user_obj, workspace_obj, project_obj = ensure_default_data(db)
    proj_id = project_id or project_obj.id

    file_bytes = await file.read()
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "txt"
    stype = ext if ext in ("pdf", "docx", "md") else "txt"

    db_source = Source(
        filename=file.filename,
        original_filename=file.filename,
        file_size=len(file_bytes),
        content_type=file.content_type or "application/octet-stream",
        source_type=stype,
        status="processing",
        project_id=proj_id,
        workspace_id=workspace_obj.id,
        uploader_id=user_obj.id
    )
    db.add(db_source)
    db.commit()
    db.refresh(db_source)

    extracted_text = IngestionService.extract_text_from_file(file_bytes, file.filename, stype)
    IngestionService.process_source_content(db, db_source, extracted_text)
    return db_source

@router.post("/url", response_model=source_schema.Source, status_code=status.HTTP_201_CREATED)
async def create_url_source(
    data: source_schema.SourceCreateUrl,
    db: Session = Depends(get_db)
):
    user_obj, workspace_obj, project_obj = ensure_default_data(db)
    proj_id = data.project_id or project_obj.id

    db_source = Source(
        filename=data.title or data.url[:40],
        original_filename=data.url,
        source_type="url",
        status="processing",
        project_id=proj_id,
        workspace_id=workspace_obj.id,
        uploader_id=user_obj.id
    )
    db.add(db_source)
    db.commit()
    db.refresh(db_source)

    try:
        raw_text = await IngestionService.extract_text_from_url(data.url)
        IngestionService.process_source_content(db, db_source, raw_text)
    except Exception as e:
        db_source.status = "failed"
        db.commit()
        raise HTTPException(status_code=400, detail=str(e))

    return db_source

@router.get("/", response_model=List[source_schema.Source])
def read_sources(
    project_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    ensure_default_data(db)
    query = db.query(Source).filter(Source.status != "deleted")
    if project_id:
        query = query.filter(Source.project_id == project_id)
    return query.order_by(Source.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{source_id}", response_model=source_schema.Source)
def read_source(
    source_id: int,
    db: Session = Depends(get_db)
):
    db_source = db.query(Source).filter(Source.id == source_id).first()
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    return db_source

@router.get("/{source_id}/blocks", response_model=List[source_schema.BlockSchema])
def read_source_blocks(source_id: int, db: Session = Depends(get_db)):
    return db.query(Block).filter(Block.source_id == source_id).order_by(Block.block_index.asc()).all()

@router.get("/{source_id}/chunks", response_model=List[source_schema.ChunkSchema])
def read_source_chunks(source_id: int, db: Session = Depends(get_db)):
    return db.query(Chunk).filter(Chunk.source_id == source_id).order_by(Chunk.chunk_index.asc()).all()

@router.get("/{source_id}/claims", response_model=List[source_schema.ClaimSchema])
def read_source_claims(source_id: int, db: Session = Depends(get_db)):
    return db.query(Claim).filter(Claim.source_id == source_id).all()

@router.delete("/{source_id}")
def delete_source(source_id: int, db: Session = Depends(get_db)):
    db_source = db.query(Source).filter(Source.id == source_id).first()
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    
    db_source.status = "deleted"
    db.commit()
    return {"message": "Source soft deleted"}
