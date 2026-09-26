from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import OutputVersion, WebhookEndpoint
from app.services.delivery import DeliveryService
from app.schemas import webhook as webhook_schema

router = APIRouter()

@router.get("/output-versions/{version_id}/download")
def download_output_version(
    version_id: int,
    format: str = "md",
    db: Session = Depends(get_db)
):
    version = db.query(OutputVersion).filter(OutputVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
    
    content_str, mime_type = DeliveryService.format_export(version, format.lower())
    
    filename = f"transformation_{version.output.transform_type}_v{version.version}.{format}"
    return Response(
        content=content_str,
        media_type=mime_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.post("/output-versions/{version_id}/deliver")
async def deliver_output_version(
    version_id: int,
    webhook_id: int,
    db: Session = Depends(get_db)
):
    version = db.query(OutputVersion).filter(OutputVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Output version not found")
    
    webhook = db.query(WebhookEndpoint).filter(WebhookEndpoint.id == webhook_id).first()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook endpoint not found")

    attempt = await DeliveryService.dispatch_webhook(db, webhook, version)
    return attempt
