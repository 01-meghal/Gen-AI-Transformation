from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import source
from app.schemas import source as source_schema

router = APIRouter()

@router.post("/sources", response_model=source_schema.Source, status_code=status.HTTP_201_CREATED)
def create_source_for_ingestion(
    source_in: source_schema.SourceCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new source for ingestion.
    """
    db_source = source.Source(
        filename=source_in.filename,
        original_filename=source_in.original_filename,
        file_size=source_in.file_size,
        content_type=source_in.content_type,
        source_type=source_in.source_type,
        status=source_in.status,
        content=source_in.content,
        object_key=source_in.object_key,
        language=source_in.language,
        word_count=source_in.word_count,
        chunk_count=source_in.chunk_count,
        project_id=source_in.project_id,
        workspace_id=source_in.workspace_id,
        uploader_id=source_in.uploader_id
    )
    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source

@router.get("/sources", response_model=List[source_schema.Source])
def read_sources_for_ingestion(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve sources for ingestion.
    """
    sources = db.query(source.Source).offset(skip).limit(limit).all()
    return sources

@router.get("/sources/{source_id}", response_model=source_schema.Source)
def read_source_for_ingestion(
    source_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific source by ID for ingestion.
    """
    db_source = db.query(source.Source).filter(source.Source.id == source_id).first()
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    return db_source

# Additional ingestion-specific endpoints can be added here
