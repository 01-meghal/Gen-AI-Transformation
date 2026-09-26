from sqlalchemy import Column, String, Text, Boolean, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class Project(BaseModel):
    __tablename__ = "projects"

    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="projects")
    workspace = relationship("Workspace", back_populates="projects")
    sources = relationship("Source", back_populates="project")
    outputs = relationship("Output", back_populates="project")
    output_versions = relationship("OutputVersion", back_populates="project")

    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}')>"
