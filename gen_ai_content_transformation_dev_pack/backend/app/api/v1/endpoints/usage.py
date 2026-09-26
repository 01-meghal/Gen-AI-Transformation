from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.core.database import get_db
from app.models import UsageRecord
from app.schemas import usage as usage_schema
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.get("/", response_model=List[usage_schema.UsageRecord])
def read_usage_records(db: Session = Depends(get_db)):
    ensure_default_data(db)
    return db.query(UsageRecord).order_by(UsageRecord.created_at.desc()).limit(100).all()

@router.get("/summary", response_model=usage_schema.UsageSummary)
def read_usage_summary(db: Session = Depends(get_db)):
    ensure_default_data(db)
    records = db.query(UsageRecord).all()
    in_tok = sum(r.input_tokens for r in records)
    out_tok = sum(r.output_tokens for r in records)
    cost = sum(r.estimated_cost_usd for r in records)
    return {
        "total_input_tokens": in_tok,
        "total_output_tokens": out_tok,
        "total_cost_usd": round(cost, 6),
        "total_generations": len(records)
    }
