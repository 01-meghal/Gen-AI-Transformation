from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    workspace_id: int
    owner_id: Optional[int] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Project(ProjectBase):
    id: int
    workspace_id: int
    owner_id: int
    is_active: bool
    created_at: Optional[datetime] = None
    source_count: Optional[int] = 0
    output_count: Optional[int] = 0

    class Config:
        from_attributes = True
