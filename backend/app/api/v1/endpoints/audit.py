from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import AuditEvent
from app.schemas import audit as audit_schema
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.get("/", response_model=List[audit_schema.AuditEvent])
def read_audit_events(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    ensure_default_data(db)
    return db.query(AuditEvent).order_by(AuditEvent.created_at.desc()).offset(skip).limit(limit).all()
