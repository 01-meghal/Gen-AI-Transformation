from sqlalchemy import Column, String, Text, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class UsageRecord(BaseModel):
    __tablename__ = "usage_records"

    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    provider = Column(String(50), nullable=False)  # anthropic, openai, fallback
    model = Column(String(100), nullable=False)  # claude-3-5-sonnet, gpt-4o, etc.
    input_tokens = Column(Integer, nullable=False, default=0)
    output_tokens = Column(Integer, nullable=False, default=0)
    estimated_cost_usd = Column(Float, nullable=False, default=0.0)
    latency_ms = Column(Integer, nullable=False, default=0)

    # Relationships
    workspace = relationship("Workspace")

    def __repr__(self):
        return f"<UsageRecord(id={self.id}, model='{self.model}', tokens={self.input_tokens}+{self.output_tokens})>"
