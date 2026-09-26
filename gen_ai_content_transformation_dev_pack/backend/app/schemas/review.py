from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    decision: str  # approved, changes_requested, rejected
    comment: Optional[str] = None

class Review(ReviewCreate):
    id: int
    output_version_id: int
    reviewer_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    output_id: int
    output_version_id: Optional[int] = None
    parent_id: Optional[int] = None
    anchor: Optional[str] = None
    body: str

class Comment(CommentCreate):
    id: int
    author_id: int
    resolved_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
