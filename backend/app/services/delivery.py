import json
import hmac
import hashlib
import httpx
from typing import Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from app.models import OutputVersion, WebhookEndpoint, DeliveryAttempt, AuditEvent

class DeliveryService:
    @staticmethod
    def format_export(version: OutputVersion, format_type: str) -> Tuple[str, str]:
        """
        Returns (formatted_string_content, mime_type)
        """
        content_json = json.loads(version.content) if isinstance(version.content, str) else version.content

        if format_type == "json":
            return json.dumps(content_json, indent=2), "application/json"
        
        elif format_type == "txt":
            # Plain text version stripped of markdown formatting
            rendered = version.rendered_text or str(content_json)
            plain = rendered.replace("#", "").replace("*", "").replace("`", "")
            return plain, "text/plain"

        elif format_type == "html":
            rendered = version.rendered_text or str(content_json)
            html = f"<!DOCTYPE html><html><head><title>Export</title><style>body{{font-family:sans-serif;padding:2rem;line-height:1.6;}}</style></head><body><pre>{rendered}</pre></body></html>"
            return html, "text/html"

        # Default markdown
        return version.rendered_text or json.dumps(content_json), "text/markdown"

    @staticmethod
    async def dispatch_webhook(db: Session, webhook: WebhookEndpoint, version: OutputVersion) -> DeliveryAttempt:
        payload = {
            "event": "transformation.completed",
            "output_id": version.output_id,
            "version_id": version.id,
            "transform_type": version.output.transform_type,
            "content": json.loads(version.content) if isinstance(version.content, str) else version.content,
            "rendered_text": version.rendered_text
        }
        body_bytes = json.dumps(payload).encode("utf-8")

        # Generate HMAC SHA256 Signature
        signature = hmac.new(webhook.secret.encode("utf-8"), body_bytes, hashlib.sha256).hexdigest()

        attempt = DeliveryAttempt(
            webhook_endpoint_id=webhook.id,
            output_version_id=version.id,
            status="pending",
            attempt_no=1
        )
        db.add(attempt)
        db.flush()

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    webhook.url,
                    content=body_bytes,
                    headers={
                        "Content-Type": "application/json",
                        "X-Signature": f"sha256={signature}"
                    }
                )
                attempt.http_status = resp.status_code
                if resp.is_success:
                    attempt.status = "delivered"
                else:
                    attempt.status = "failed"
                attempt.response_excerpt = resp.text[:300]
        except Exception as e:
            attempt.status = "failed"
            attempt.response_excerpt = str(e)[:300]

        db.commit()
        db.refresh(attempt)
        return attempt
