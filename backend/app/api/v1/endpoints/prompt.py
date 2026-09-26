from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from app.core.database import get_db
from app.models import PromptTemplate, PromptVersion
from app.schemas import prompt as prompt_schema
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.get("/templates", response_model=List[prompt_schema.PromptTemplate])
def read_prompt_templates(db: Session = Depends(get_db)):
    ensure_default_data(db)
    return db.query(PromptTemplate).all()

@router.post("/templates", response_model=prompt_schema.PromptTemplate)
def create_prompt_template(
    body: prompt_schema.PromptTemplateCreate,
    db: Session = Depends(get_db)
):
    _, workspace_obj, _ = ensure_default_data(db)
    tmpl = PromptTemplate(
        workspace_id=body.workspace_id or workspace_obj.id,
        transform_type=body.transform_type,
        name=body.name
    )
    db.add(tmpl)
    db.commit()
    db.refresh(tmpl)
    return tmpl

@router.post("/templates/{template_id}/versions", response_model=prompt_schema.PromptVersion)
def create_prompt_version(
    template_id: int,
    body: prompt_schema.PromptVersionBase,
    db: Session = Depends(get_db)
):
    user_obj, _, _ = ensure_default_data(db)
    tmpl = db.query(PromptTemplate).filter(PromptTemplate.id == template_id).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")
    
    max_v = db.query(PromptVersion).filter(PromptVersion.prompt_template_id == template_id).count()
    
    ver = PromptVersion(
        prompt_template_id=template_id,
        version=max_v + 1,
        system_text=body.system_text,
        developer_text=body.developer_text,
        input_schema=json.dumps(body.input_schema) if body.input_schema else None,
        output_schema=json.dumps(body.output_schema) if body.output_schema else None,
        model_defaults=json.dumps(body.model_defaults) if body.model_defaults else None,
        created_by_id=user_obj.id
    )
    db.add(ver)
    db.commit()
    db.refresh(ver)
    return ver
