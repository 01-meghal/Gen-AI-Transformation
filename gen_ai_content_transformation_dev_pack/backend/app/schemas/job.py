from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    job_type: str
    status: str = "queued"
    progress: int = 0
    attempt_count: int = 0
    idempotency_key: Optional[str] = None
    error_code: Optional[str] = None
    error_safe_message: Optional[str] = None
    job_metadata: Optional[str] = None

class JobCreate(JobBase):
    workspace_id: int
    batch_id: Optional[int] = None
    source_id: Optional[int] = None
    output_id: Optional[int] = None

class Job(JobBase):
    id: int
    workspace_id: int
    batch_id: Optional[int] = None
    source_id: Optional[int] = None
    output_id: Optional[int] = None
    created_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
