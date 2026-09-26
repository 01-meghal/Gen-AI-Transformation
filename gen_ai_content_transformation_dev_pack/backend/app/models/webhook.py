from sqlalchemy import Column, String, Text, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from .base import BaseModel

class WebhookEndpoint(BaseModel):
    __tablename__ = "webhook_endpoints"

    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    name = Column(String(255), nullable=False)
    url = Column(String(1024), nullable=False)
    secret = Column(String(255), nullable=False)
    enabled = Column(Boolean, nullable=False, default=True)
    event_types = Column(Text, nullable=False)  # JSON array of events, e.g. ["transformation.completed"]

    # Relationships
    workspace = relationship("Workspace", back_populates="webhooks")
    delivery_attempts = relationship("DeliveryAttempt", back_populates="webhook_endpoint", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<WebhookEndpoint(id={self.id}, name='{self.name}', url='{self.url}')>"


class DeliveryAttempt(BaseModel):
    __tablename__ = "delivery_attempts"

    webhook_endpoint_id = Column(Integer, ForeignKey("webhook_endpoints.id"), nullable=False)
    output_version_id = Column(Integer, ForeignKey("output_versions.id"), nullable=False)
    status = Column(String(30), nullable=False, default="pending")  # pending, delivered, failed
    http_status = Column(Integer, nullable=True)
    attempt_no = Column(Integer, nullable=False, default=1)
    next_retry_at = Column(DateTime(timezone=True), nullable=True)
    response_excerpt = Column(Text, nullable=True)

    # Relationships
    webhook_endpoint = relationship("WebhookEndpoint", back_populates="delivery_attempts")
    output_version = relationship("OutputVersion")

    def __repr__(self):
        return f"<DeliveryAttempt(id={self.id}, status='{self.status}', attempt_no={self.attempt_no})>"
