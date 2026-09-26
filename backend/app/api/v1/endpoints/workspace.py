from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import Workspace
from app.schemas import workspace as workspace_schema
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.post("/", response_model=workspace_schema.Workspace, status_code=status.HTTP_201_CREATED)
def create_workspace(
    workspace_in: workspace_schema.WorkspaceCreate,
    db: Session = Depends(get_db)
):
    db_workspace = Workspace(
        name=workspace_in.name,
        description=workspace_in.description,
        settings=workspace_in.settings
    )
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

@router.get("/", response_model=List[workspace_schema.Workspace])
def read_workspaces(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    ensure_default_data(db)
    return db.query(Workspace).offset(skip).limit(limit).all()

@router.get("/{workspace_id}", response_model=workspace_schema.Workspace)
def read_workspace(
    workspace_id: int,
    db: Session = Depends(get_db)
):
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if db_workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return db_workspace

@router.put("/{workspace_id}", response_model=workspace_schema.Workspace)
def update_workspace(
    workspace_id: int,
    workspace_in: workspace_schema.WorkspaceUpdate,
    db: Session = Depends(get_db)
):
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if db_workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    update_data = workspace_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_workspace, field, value)
    
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace
