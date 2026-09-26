from sqlalchemy import Column, String, Boolean, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class User(BaseModel):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    role = Column(String(50), default="editor", nullable=False)  # admin, editor, reviewer, viewer
    
    # Foreign keys
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="users")
    projects = relationship("Project", back_populates="owner")
    sources = relationship("Source", back_populates="uploader")
    output_versions = relationship("OutputVersion", back_populates="creator")
    transformation_batches = relationship("TransformationBatch", back_populates="requested_by")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"
