from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from app.core.database import get_db
from app.models import WebhookEndpoint, DeliveryAttempt
from app.schemas import webhook as webhook_schema
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.post("/", response_model=webhook_schema.WebhookEndpoint, status_code=status.HTTP_201_CREATED)
def create_webhook_endpoint(
    body: webhook_schema.WebhookEndpointBase,
    db: Session = Depends(get_db)
):
    _, workspace_obj, _ = ensure_default_data(db)
    wh = WebhookEndpoint(
        workspace_id=workspace_obj.id,
        name=body.name,
        url=body.url,
        secret=body.secret,
        enabled=body.enabled,
        event_types=json.dumps(body.event_types)
    )
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh

@router.get("/", response_model=List[webhook_schema.WebhookEndpoint])
def read_webhook_endpoints(db: Session = Depends(get_db)):
    ensure_default_data(db)
    return db.query(WebhookEndpoint).all()

@router.get("/attempts", response_model=List[webhook_schema.DeliveryAttempt])
def read_delivery_attempts(db: Session = Depends(get_db)):
    return db.query(DeliveryAttempt).order_by(DeliveryAttempt.created_at.desc()).limit(50).all()
