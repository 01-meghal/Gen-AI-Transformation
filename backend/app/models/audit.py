from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class AuditEvent(BaseModel):
    __tablename__ = "audit_events"

    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    actor_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    event_type = Column(String(100), nullable=False)  # source.created, output.generated, review.approved, etc.
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(100), nullable=False)
    request_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)  # JSON payload

    # Relationships
    workspace = relationship("Workspace")
    actor = relationship("User")

    def __repr__(self):
        return f"<AuditEvent(id={self.id}, type='{self.event_type}', resource='{self.resource_type}:{self.resource_id}')>"
