from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Source(BaseModel):
    __tablename__ = "sources"

    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=True)  # in bytes
    content_type = Column(String(100), nullable=True)
    source_type = Column(String(20), nullable=False)  # text, txt, md, pdf, docx, url
    status = Column(String(20), nullable=False, default="processing")       # created, validating, processing, ready, failed, deleted
    
    # Content storage
    content = Column(Text, nullable=True)  # extracted text content
    object_key = Column(String(500), nullable=True)  # S3/MinIO/local object key
    
    # Processing metadata
    language = Column(String(10), nullable=True, default="en")  # ISO language code
    word_count = Column(Integer, nullable=True, default=0)
    chunk_count = Column(Integer, nullable=True, default=0)
    source_metadata = Column(Text, nullable=True)  # JSON string
    
    # Foreign keys
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    uploader_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="sources")
    workspace = relationship("Workspace", back_populates="sources")
    uploader = relationship("User", back_populates="sources")
    blocks = relationship("Block", back_populates="source", cascade="all, delete-orphan")
    chunks = relationship("Chunk", back_populates="source", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="source", cascade="all, delete-orphan")
    transformation_batches = relationship("TransformationBatch", back_populates="source", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="source", cascade="all, delete-orphan")
    outputs = relationship("Output", back_populates="source", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Source(id={self.id}, filename='{self.filename}', status='{self.status}')>"
