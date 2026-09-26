from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Output(BaseModel):
    __tablename__ = "outputs"

    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("transformation_batches.id"), nullable=True)
    
    transform_type = Column(String(50), nullable=False)  # executive_summary, linkedin_post, twitter_x, advisory, infographic_spec, presentation, video_package
    status = Column(String(30), nullable=False, default="draft")  # draft, in_review, approved, changes_requested, rejected
    current_version_id = Column(Integer, ForeignKey("output_versions.id", use_alter=True, name="fk_output_current_version"), nullable=True)

    # Relationships
    workspace = relationship("Workspace", back_populates="outputs")
    project = relationship("Project", back_populates="outputs")
    source = relationship("Source", back_populates="outputs")
    batch = relationship("TransformationBatch", back_populates="outputs")
    jobs = relationship("Job", back_populates="output")
    versions = relationship("OutputVersion", foreign_keys="[OutputVersion.output_id]", back_populates="output", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Output(id={self.id}, type='{self.transform_type}', status='{self.status}')>"
