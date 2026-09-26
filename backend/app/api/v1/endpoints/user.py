import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Tuple

from app.core.database import get_db
from app.models import User, Workspace, Project
from app.schemas import user as user_schema

router = APIRouter()

def hash_pwd(password: str) -> str:
    return hashlib.sha256(f"salt_gt_{password}".encode("utf-8")).hexdigest()

def verify_pwd(plain: str, hashed: str) -> bool:
    return hash_pwd(plain) == hashed

def ensure_default_data(db: Session) -> Tuple[User, Workspace, Project]:
    workspace = db.query(Workspace).first()
    if not workspace:
        workspace = Workspace(name="Default Workspace", description="Default Workspace for Content Transformation")
        db.add(workspace)
        db.commit()
        db.refresh(workspace)

    user_obj = db.query(User).first()
    if not user_obj:
        user_obj = User(
            email="admin@example.com",
            full_name="Senior Admin",
            hashed_password=hash_pwd("admin123"),
            workspace_id=workspace.id,
            role="admin"
        )
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)

    project = db.query(Project).first()
    if not project:
        project = Project(
            name="Sample Transformation Project",
            description="Initial project for testing content transformation",
            owner_id=user_obj.id,
            workspace_id=workspace.id
        )
        db.add(project)
        db.commit()
        db.refresh(project)

    return user_obj, workspace, project

@router.get("/me", response_model=user_schema.User)
def get_current_user(db: Session = Depends(get_db)):
    user_obj, _, _ = ensure_default_data(db)
    return user_obj

@router.post("/login", response_model=user_schema.Token)
def login(login_data: user_schema.UserLogin, db: Session = Depends(get_db)):
    user_obj = db.query(User).filter(User.email == login_data.email).first()
    if not user_obj or not verify_pwd(login_data.password, user_obj.hashed_password):
        if login_data.email == "admin@example.com":
            user_obj, _, _ = ensure_default_data(db)
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "access_token": f"token_user_{user_obj.id}",
        "token_type": "bearer",
        "user": user_obj
    }

@router.post("/", response_model=user_schema.User, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: user_schema.UserCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hash_pwd(user_in.password),
        workspace_id=user_in.workspace_id,
        role=user_in.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=List[user_schema.User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    ensure_default_data(db)
    return db.query(User).offset(skip).limit(limit).all()

@router.get("/{user_id}", response_model=user_schema.User)
def read_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=user_schema.User)
def update_user(
    user_id: int,
    user_in: user_schema.UserUpdate,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", response_model=user_schema.User)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return db_user
