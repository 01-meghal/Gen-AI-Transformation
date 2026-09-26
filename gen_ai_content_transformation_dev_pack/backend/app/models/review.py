from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Review(BaseModel):
    __tablename__ = "reviews"

    output_version_id = Column(Integer, ForeignKey("output_versions.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    decision = Column(String(30), nullable=False)  # approved, changes_requested, rejected
    comment = Column(Text, nullable=True)

    # Relationships
    output_version = relationship("OutputVersion", back_populates="reviews")
    reviewer = relationship("User")

    def __repr__(self):
        return f"<Review(id={self.id}, version_id={self.output_version_id}, decision='{self.decision}')>"
