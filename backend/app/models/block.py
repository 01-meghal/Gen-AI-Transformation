from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Block(BaseModel):
    __tablename__ = "blocks"

    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    block_index = Column(Integer, nullable=False)  # order within the source
    content = Column(Text, nullable=False)
    block_type = Column(String(50), nullable=True)  # e.g., paragraph, heading, list, etc.
    # Additional metadata as JSON string
    block_metadata = Column(Text, nullable=True)  # JSON string for additional block-specific metadata
    
    # Relationships
    source = relationship("Source", back_populates="blocks")
    chunks = relationship("Chunk", back_populates="block", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Block(id={self.id}, source_id={self.source_id}, block_index={self.block_index})>"
