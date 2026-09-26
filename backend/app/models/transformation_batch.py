from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class TransformationBatch(BaseModel):
    __tablename__ = "transformation_batches"

    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    requested_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(30), nullable=False, default="processing")  # processing, completed, partial_failure, failed
    configuration = Column(Text, nullable=True)  # JSON config (audience, tone, language, detail, objective, etc)

    # Relationships
    source = relationship("Source", back_populates="transformation_batches")
    workspace = relationship("Workspace", back_populates="transformation_batches")
    requested_by = relationship("User", back_populates="transformation_batches")
    jobs = relationship("Job", back_populates="batch", cascade="all, delete-orphan")
    outputs = relationship("Output", back_populates="batch", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<TransformationBatch(id={self.id}, source_id={self.source_id})>"
