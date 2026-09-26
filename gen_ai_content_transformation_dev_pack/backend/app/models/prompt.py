from sqlalchemy import Column, String, Text, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .base import BaseModel

class PromptTemplate(BaseModel):
    __tablename__ = "prompt_templates"

    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True)  # NULL for global system templates
    transform_type = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    status = Column(String(30), nullable=False, default="active")  # active, deprecated, draft

    # Relationships
    workspace = relationship("Workspace", back_populates="prompt_templates")
    versions = relationship("PromptVersion", back_populates="template", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<PromptTemplate(id={self.id}, name='{self.name}', type='{self.transform_type}')>"


class PromptVersion(BaseModel):
    __tablename__ = "prompt_versions"

    prompt_template_id = Column(Integer, ForeignKey("prompt_templates.id"), nullable=False)
    version = Column(Integer, nullable=False, default=1)
    system_text = Column(Text, nullable=False)
    developer_text = Column(Text, nullable=False)
    input_schema = Column(Text, nullable=True)  # JSON string
    output_schema = Column(Text, nullable=True)  # JSON string
    model_defaults = Column(Text, nullable=True)  # JSON string
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    __table_args__ = (
        UniqueConstraint('prompt_template_id', 'version', name='uq_prompt_version'),
    )

    # Relationships
    template = relationship("PromptTemplate", back_populates="versions")
    creator = relationship("User")

    def __repr__(self):
        return f"<PromptVersion(id={self.id}, template_id={self.prompt_template_id}, version={self.version})>"
