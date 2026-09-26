from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: str = "editor"
    is_active: bool = True
    is_verified: bool = False

class UserCreate(UserBase):
    password: str
    workspace_id: int

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    workspace_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User
