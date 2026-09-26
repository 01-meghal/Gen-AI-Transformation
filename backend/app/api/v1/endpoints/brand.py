from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from app.core.database import get_db
from app.models import BrandProfile
from app.schemas import brand as brand_schema
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.post("/", response_model=brand_schema.BrandProfile, status_code=status.HTTP_201_CREATED)
def create_brand_profile(
    body: brand_schema.BrandProfileCreate,
    db: Session = Depends(get_db)
):
    _, workspace_obj, _ = ensure_default_data(db)
    brand = BrandProfile(
        workspace_id=body.workspace_id or workspace_obj.id,
        name=body.name,
        voice_rules=json.dumps(body.voice_rules) if body.voice_rules else None,
        visual_tokens=json.dumps(body.visual_tokens) if body.visual_tokens else None,
        forbidden_terms=json.dumps(body.forbidden_terms) if body.forbidden_terms else None,
        preferred_terms=json.dumps(body.preferred_terms) if body.preferred_terms else None
    )
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand

@router.get("/", response_model=List[brand_schema.BrandProfile])
def read_brand_profiles(db: Session = Depends(get_db)):
    ensure_default_data(db)
    return db.query(BrandProfile).all()

@router.get("/{brand_id}", response_model=brand_schema.BrandProfile)
def read_brand_profile(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(BrandProfile).filter(BrandProfile.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    return brand
