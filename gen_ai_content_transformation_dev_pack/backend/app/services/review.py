import json
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from app.models import Output, OutputVersion, Review, Comment, AuditEvent
from app.services.transformer import RendererEngine, QualityGuardrails

class ReviewService:
    @staticmethod
    def create_user_edited_version(
        db: Session,
        output_id: int,
        content_dict: Dict[str, Any],
        user_id: int,
        configuration: Optional[Dict[str, Any]] = None
    ) -> OutputVersion:
        output = db.query(Output).filter(Output.id == output_id).first()
        if not output:
            raise ValueError("Output not found")
        
        # Calculate new version number
        max_version = db.query(OutputVersion).filter(OutputVersion.output_id == output_id).count()
        next_ver_no = max_version + 1

        rendered = RendererEngine.render_to_markdown(output.transform_type, content_dict)
        quality = QualityGuardrails.evaluate(content_dict, rendered, output.transform_type)

        new_version = OutputVersion(
            output_id=output.id,
            project_id=output.project_id,
            version=next_ver_no,
            origin="user_edit",
            content=json.dumps(content_dict),
            rendered_text=rendered,
            configuration=json.dumps(configuration) if configuration else output.current_version.configuration,
            quality_report=json.dumps(quality),
            created_by_id=user_id
        )
        db.add(new_version)
        db.flush()

        output.current_version_id = new_version.id
        output.status = "draft"
        
        # Log Audit Event
        audit = AuditEvent(
            workspace_id=output.workspace_id,
            actor_user_id=user_id,
            event_type="output.edited",
            resource_type="output",
            resource_id=str(output.id),
            details=json.dumps({"version": next_ver_no, "origin": "user_edit"})
        )
        db.add(audit)

        db.commit()
        db.refresh(new_version)
        return new_version

    @staticmethod
    def submit_review(
        db: Session,
        version_id: int,
        reviewer_id: int,
        decision: str,  # approved, changes_requested, rejected
        comment_text: Optional[str] = None
    ) -> Review:
        version = db.query(OutputVersion).filter(OutputVersion.id == version_id).first()
        if not version:
            raise ValueError("OutputVersion not found")
        
        output = version.output
        
        review = Review(
            output_version_id=version.id,
            reviewer_id=reviewer_id,
            decision=decision,
            comment=comment_text
        )
        db.add(review)

        if decision == "approved":
            output.status = "approved"
        elif decision == "changes_requested":
            output.status = "changes_requested"
        elif decision == "rejected":
            output.status = "rejected"

        # Audit Event
        audit = AuditEvent(
            workspace_id=output.workspace_id,
            actor_user_id=reviewer_id,
            event_type=f"review.{decision}",
            resource_type="output_version",
            resource_id=str(version.id),
            details=json.dumps({"decision": decision, "comment": comment_text})
        )
        db.add(audit)

        db.commit()
        db.refresh(review)
        return review
