from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class BrandProfile(BaseModel):
    __tablename__ = "brand_profiles"

    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    name = Column(String(255), nullable=False)
    voice_rules = Column(Text, nullable=True)  # JSON string of voice rules
    visual_tokens = Column(Text, nullable=True)  # JSON string of visual style guidelines
    forbidden_terms = Column(Text, nullable=True)  # JSON array of forbidden terms
    preferred_terms = Column(Text, nullable=True)  # JSON mapping of preferred terms
    active_version = Column(Integer, nullable=False, default=1)

    # Relationships
    workspace = relationship("Workspace", back_populates="brand_profiles")

    def __repr__(self):
        return f"<BrandProfile(id={self.id}, name='{self.name}')>"
