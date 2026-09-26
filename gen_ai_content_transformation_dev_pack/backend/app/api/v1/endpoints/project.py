from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import Project, Source, Output
from app.schemas import project as project_schema
from app.api.v1.endpoints.user import ensure_default_data

router = APIRouter()

@router.post("/", response_model=project_schema.Project, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: project_schema.ProjectCreate,
    db: Session = Depends(get_db)
):
    user_obj, workspace_obj, _ = ensure_default_data(db)
    db_project = Project(
        name=project_in.name,
        description=project_in.description,
        workspace_id=project_in.workspace_id or workspace_obj.id,
        owner_id=project_in.owner_id or user_obj.id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/", response_model=List[project_schema.Project])
def read_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    ensure_default_data(db)
    projects = db.query(Project).filter(Project.is_active == True).offset(skip).limit(limit).all()
    res = []
    for p in projects:
        p_dict = project_schema.Project.from_orm(p)
        p_dict.source_count = db.query(Source).filter(Source.project_id == p.id, Source.status != "deleted").count()
        p_dict.output_count = db.query(Output).filter(Output.project_id == p.id).count()
        res.append(p_dict)
    return res

@router.get("/{project_id}", response_model=project_schema.Project)
def read_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    p_dict = project_schema.Project.from_orm(db_project)
    p_dict.source_count = db.query(Source).filter(Source.project_id == db_project.id, Source.status != "deleted").count()
    p_dict.output_count = db.query(Output).filter(Output.project_id == db_project.id).count()
    return p_dict

@router.put("/{project_id}", response_model=project_schema.Project)
def update_project(
    project_id: int,
    project_in: project_schema.ProjectUpdate,
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.is_active = False
    db.commit()
    return {"message": "Project archived"}
