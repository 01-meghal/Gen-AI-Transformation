from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import Output, OutputVersion, Review, Comment
from app.schemas import review as review_schema
from app.services.review import ReviewService
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.post("/output-versions/{version_id}/reviews", response_model=review_schema.Review)
def submit_review(
    version_id: int,
    body: review_schema.ReviewCreate,
    db: Session = Depends(get_db)
):
    user_obj, _, _ = ensure_default_data(db)
    try:
        rev = ReviewService.submit_review(
            db=db,
            version_id=version_id,
            reviewer_id=user_obj.id,
            decision=body.decision,
            comment_text=body.comment
        )
        return rev
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/queue")
def get_review_queue(db: Session = Depends(get_db)):
    ensure_default_data(db)
    outputs = db.query(Output).filter(Output.status.in_(["draft", "in_review", "changes_requested"])).all()
    return outputs

@router.post("/comments", response_model=review_schema.Comment)
def create_comment(
    body: review_schema.CommentCreate,
    db: Session = Depends(get_db)
):
    user_obj, _, _ = ensure_default_data(db)
    c = Comment(
        output_id=body.output_id,
        output_version_id=body.output_version_id,
        author_id=user_obj.id,
        parent_id=body.parent_id,
        anchor=body.anchor,
        body=body.body
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.get("/outputs/{output_id}/comments", response_model=List[review_schema.Comment])
def get_comments(output_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.output_id == output_id).order_by(Comment.created_at.asc()).all()
