from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class OutputVersionBase(BaseModel):
    model_config = {"protected_namespaces": ()}
    version: int = 1
    origin: str = "ai"  # ai, user_edit, regeneration, section_regeneration
    content: Any  # Dict or JSON object of output structure
    rendered_text: Optional[str] = None
    configuration: Optional[Any] = None
    quality_report: Optional[Any] = None
    model_metadata: Optional[Any] = None

class OutputVersionCreate(BaseModel):
    prior_version_id: Optional[int] = None
    content: Dict[str, Any]
    configuration: Optional[Dict[str, Any]] = None

class OutputVersion(OutputVersionBase):
    id: int
    output_id: int
    created_by_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class OutputBase(BaseModel):
    transform_type: str
    status: str = "draft"

class Output(OutputBase):
    id: int
    workspace_id: int
    project_id: int
    source_id: int
    batch_id: Optional[int] = None
    current_version_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    current_version: Optional[OutputVersion] = None

    class Config:
        from_attributes = True
