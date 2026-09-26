from sqlalchemy import Column, String, Text, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Claim(BaseModel):
    __tablename__ = "claims"

    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    claim_text = Column(Text, nullable=False)
    claim_type = Column(String(50), nullable=False, default="fact")  # fact, statistic, recommendation, quote
    importance = Column(Integer, nullable=False, default=1)  # 1 (low) to 5 (high)
    confidence = Column(Float, nullable=False, default=1.0)
    evidence = Column(Text, nullable=True)  # JSON string containing block/chunk refs and quotes

    # Relationships
    source = relationship("Source", back_populates="claims")

    def __repr__(self):
        return f"<Claim(id={self.id}, source_id={self.source_id}, type='{self.claim_type}')>"
