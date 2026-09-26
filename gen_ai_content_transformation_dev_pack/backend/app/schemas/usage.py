from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UsageRecordCreate(BaseModel):
    workspace_id: int
    job_id: Optional[int] = None
    provider: str
    model: str
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: float
    latency_ms: int

class UsageRecord(UsageRecordCreate):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UsageSummary(BaseModel):
    total_input_tokens: int
    total_output_tokens: int
    total_cost_usd: float
    total_generations: int
