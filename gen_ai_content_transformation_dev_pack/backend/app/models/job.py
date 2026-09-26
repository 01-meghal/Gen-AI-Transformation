from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from .base import BaseModel

class Job(BaseModel):
    __tablename__ = "jobs"

    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("transformation_batches.id"), nullable=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    output_id = Column(Integer, ForeignKey("outputs.id"), nullable=True)
    
    job_type = Column(String(50), nullable=False)  # ingestion, transformation, regeneration, webhook_delivery
    status = Column(String(30), nullable=False, default="queued")  # queued, processing, completed, failed, cancelled
    progress = Column(Integer, nullable=False, default=0)
    attempt_count = Column(Integer, nullable=False, default=0)
    idempotency_key = Column(String(255), nullable=True, index=True)
    error_code = Column(String(100), nullable=True)
    error_safe_message = Column(Text, nullable=True)
    
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    job_metadata = Column(Text, nullable=True)  # JSON metadata

    # Relationships
    workspace = relationship("Workspace", back_populates="jobs")
    batch = relationship("TransformationBatch", back_populates="jobs")
    source = relationship("Source", back_populates="jobs")
    output = relationship("Output", back_populates="jobs")

    def __repr__(self):
        return f"<Job(id={self.id}, type='{self.job_type}', status='{self.status}')>"
