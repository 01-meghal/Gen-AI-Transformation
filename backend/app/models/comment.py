from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .base import BaseModel

class Comment(BaseModel):
    __tablename__ = "comments"

    output_id = Column(Integer, ForeignKey("outputs.id"), nullable=False)
    output_version_id = Column(Integer, ForeignKey("output_versions.id"), nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    anchor = Column(Text, nullable=True)  # JSON anchor info (section path or text offset)
    body = Column(Text, nullable=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    output_version = relationship("OutputVersion", back_populates="comments")
    author = relationship("User")
    parent = relationship("Comment", remote_side="[Comment.id]")

    def __repr__(self):
        return f"<Comment(id={self.id}, output_id={self.output_id})>"
