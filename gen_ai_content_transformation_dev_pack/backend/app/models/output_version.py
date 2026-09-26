from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class OutputVersion(BaseModel):
    __tablename__ = "output_versions"

    output_id = Column(Integer, ForeignKey("outputs.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    version = Column(Integer, nullable=False, default=1)
    origin = Column(String(30), nullable=False, default="ai")  # ai, user_edit, regeneration, section_regeneration
    
    content = Column(Text, nullable=False)  # JSON string of structured output schema
    rendered_text = Column(Text, nullable=True)  # Markdown or plain text preview
    configuration = Column(Text, nullable=True)  # JSON configuration snapshot
    prompt_version_id = Column(Integer, ForeignKey("prompt_versions.id"), nullable=True)
    model_metadata = Column(Text, nullable=True)  # JSON metadata (tokens, model name, provider)
    quality_report = Column(Text, nullable=True)  # JSON quality/safety report
    
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    output = relationship("Output", foreign_keys=[output_id], back_populates="versions")
    project = relationship("Project", back_populates="output_versions")
    creator = relationship("User", back_populates="output_versions")
    reviews = relationship("Review", back_populates="output_version", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="output_version", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<OutputVersion(id={self.id}, output_id={self.output_id}, version={self.version})>"
