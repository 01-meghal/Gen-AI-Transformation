from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    settings: Optional[str] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    settings: Optional[str] = None
    is_active: Optional[bool] = None

class Workspace(WorkspaceBase):
    id: int
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
