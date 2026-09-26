from sqlalchemy import Column, String, Text, Boolean, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class Workspace(BaseModel):
    __tablename__ = "workspaces"

    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    settings = Column(Text, nullable=True)  # JSON string of workspace settings
    
    # Relationships
    users = relationship("User", back_populates="workspace")
    projects = relationship("Project", back_populates="workspace")
    sources = relationship("Source", back_populates="workspace")
    jobs = relationship("Job", back_populates="workspace")
    transformation_batches = relationship("TransformationBatch", back_populates="workspace")
    outputs = relationship("Output", back_populates="workspace")
    brand_profiles = relationship("BrandProfile", back_populates="workspace")
    prompt_templates = relationship("PromptTemplate", back_populates="workspace")
    webhooks = relationship("WebhookEndpoint", back_populates="workspace")

    def __repr__(self):
        return f"<Workspace(id={self.id}, name='{self.name}')>"
