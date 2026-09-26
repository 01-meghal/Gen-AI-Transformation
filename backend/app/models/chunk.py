from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Chunk(BaseModel):
    __tablename__ = "chunks"

    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=True)  # optional, if we want to track which block the chunk came from
    chunk_index = Column(Integer, nullable=False)  # order within the source (or within block if block_id is set)
    content = Column(Text, nullable=False)
    # Embedding vector - we'll use pgvector, but for now we'll store as text or we can use a vector type later.
    # For simplicity, we'll store the embedding as a text representation (comma-separated) or we can use a JSON array.
    # Alternatively, we can use the pgvector type when we set up the extension.
    # We'll leave it as Text for now and change it when we set up pgvector.
    embedding = Column(Text, nullable=True)  # placeholder for embedding vector
    # Additional metadata as JSON string
    chunk_metadata = Column(Text, nullable=True)  # JSON string for additional chunk-specific metadata
    
    # Relationships
    source = relationship("Source", back_populates="chunks")
    block = relationship("Block", back_populates="chunks")

    def __repr__(self):
        return f"<Chunk(id={self.id}, source_id={self.source_id}, chunk_index={self.chunk_index})>"
