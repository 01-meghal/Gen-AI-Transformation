from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class WebhookEndpointBase(BaseModel):
    name: str
    url: str
    secret: str
    enabled: bool = True
    event_types: List[str]

class WebhookEndpointCreate(WebhookEndpointBase):
    workspace_id: int

class WebhookEndpoint(WebhookEndpointBase):
    id: int
    workspace_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DeliveryAttempt(BaseModel):
    id: int
    webhook_endpoint_id: int
    output_version_id: int
    status: str
    http_status: Optional[int] = None
    attempt_no: int
    next_retry_at: Optional[datetime] = None
    response_excerpt: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
