from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.core.database import get_db
from app.models import Source, Output, OutputVersion, TransformationBatch, Job
from app.schemas import transformation as transform_schema
from app.schemas import output as output_schema
from app.services.transformer import TransformationService
from app.services.review import ReviewService
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.post("/sources/{source_id}/transformations")
def create_transformation(
    source_id: int,
    request: transform_schema.TransformationRequest,
    db: Session = Depends(get_db)
):
    source = db.query(Source).filter(Source.id == source_id, Source.status != "deleted").first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    
    user_obj, _, _ = ensure_default_data(db)
    config_dict = request.configuration.dict() if request.configuration else {}

    # Create Batch
    batch = TransformationBatch(
        source_id=source.id,
        workspace_id=source.workspace_id,
        requested_by_id=user_obj.id,
        status="processing",
        configuration=str(config_dict)
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    created_outputs = []
    for target in request.targets:
        output = TransformationService.execute_transformation(
            db=db,
            source=source,
            transform_type=target,
            configuration=config_dict,
            user_id=user_obj.id,
            batch_id=batch.id
        )
        created_outputs.append(output)

    batch.status = "completed"
    db.commit()

    return {
        "batch_id": batch.id,
        "status": "completed",
        "outputs": [
            {
                "output_id": out.id,
                "transform_type": out.transform_type,
                "status": out.status,
                "current_version_id": out.current_version_id
            }
            for out in created_outputs
        ]
    }

@router.get("/transformation-batches/{batch_id}")
def get_transformation_batch(batch_id: int, db: Session = Depends(get_db)):
    batch = db.query(TransformationBatch).filter(TransformationBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    outputs = db.query(Output).filter(Output.batch_id == batch.id).all()
    return {
        "batch_id": batch.id,
        "status": batch.status,
        "outputs": outputs
    }

@router.get("/outputs/{output_id}", response_model=output_schema.Output)
def get_output(output_id: int, db: Session = Depends(get_db)):
    output = db.query(Output).filter(Output.id == output_id).first()
    if not output:
        raise HTTPException(status_code=404, detail="Output not found")
    return output

@router.get("/outputs/{output_id}/versions", response_model=List[output_schema.OutputVersion])
def get_output_versions(output_id: int, db: Session = Depends(get_db)):
    return db.query(OutputVersion).filter(OutputVersion.output_id == output_id).order_by(OutputVersion.version.desc()).all()

@router.get("/outputs/{output_id}/versions/{version_id}", response_model=output_schema.OutputVersion)
def get_output_version_detail(output_id: int, version_id: int, db: Session = Depends(get_db)):
    version = db.query(OutputVersion).filter(OutputVersion.id == version_id, OutputVersion.output_id == output_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
    return version

@router.post("/outputs/{output_id}/versions", response_model=output_schema.OutputVersion)
def create_edited_version(
    output_id: int,
    body: output_schema.OutputVersionCreate,
    db: Session = Depends(get_db)
):
    user_obj, _, _ = ensure_default_data(db)
    try:
        new_version = ReviewService.create_user_edited_version(
            db=db,
            output_id=output_id,
            content_dict=body.content,
            user_id=user_obj.id,
            configuration=body.configuration
        )
        return new_version
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/outputs/{output_id}/regenerate")
def regenerate_output(
    output_id: int,
    request: transform_schema.RegenerationRequest,
    db: Session = Depends(get_db)
):
    output = db.query(Output).filter(Output.id == output_id).first()
    if not output:
        raise HTTPException(status_code=404, detail="Output not found")
    
    user_obj, _, _ = ensure_default_data(db)
    source = output.source
    
    config_dict = request.configuration.dict() if request.configuration else {}
    if request.instruction:
        config_dict["custom_instruction"] = request.instruction

    new_output = TransformationService.execute_transformation(
        db=db,
        source=source,
        transform_type=output.transform_type,
        configuration=config_dict,
        user_id=user_obj.id,
        batch_id=output.batch_id
    )

    return {
        "message": "Output regenerated successfully",
        "output_id": new_output.id,
        "current_version_id": new_output.current_version_id
    }