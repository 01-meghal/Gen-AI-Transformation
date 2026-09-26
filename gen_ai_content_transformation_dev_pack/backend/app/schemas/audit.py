from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class AuditEventCreate(BaseModel):
    workspace_id: int
    actor_user_id: Optional[int] = None
    event_type: str
    resource_type: str
    resource_id: str
    request_id: Optional[str] = None
    details: Optional[Any] = None

class AuditEvent(AuditEventCreate):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
