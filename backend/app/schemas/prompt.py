from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class PromptVersionBase(BaseModel):
    model_config = {"protected_namespaces": ()}
    version: int = 1
    system_text: str
    developer_text: str
    input_schema: Optional[Any] = None
    output_schema: Optional[Any] = None
    model_defaults: Optional[Any] = None

class PromptVersionCreate(PromptVersionBase):
    prompt_template_id: int

class PromptVersion(PromptVersionBase):
    id: int
    prompt_template_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PromptTemplateBase(BaseModel):
    transform_type: str
    name: str
    status: str = "active"

class PromptTemplateCreate(PromptTemplateBase):
    workspace_id: Optional[int] = None

class PromptTemplate(PromptTemplateBase):
    id: int
    workspace_id: Optional[int] = None
    created_at: Optional[datetime] = None
    active_version: Optional[PromptVersion] = None

    class Config:
        from_attributes = True
