from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class BrandProfileBase(BaseModel):
    name: str
    voice_rules: Optional[Any] = None
    visual_tokens: Optional[Any] = None
    forbidden_terms: Optional[List[str]] = []
    preferred_terms: Optional[Dict[str, str]] = {}

class BrandProfileCreate(BrandProfileBase):
    workspace_id: int

class BrandProfileUpdate(BaseModel):
    name: Optional[str] = None
    voice_rules: Optional[Any] = None
    visual_tokens: Optional[Any] = None
    forbidden_terms: Optional[List[str]] = None
    preferred_terms: Optional[Dict[str, str]] = None

class BrandProfile(BrandProfileBase):
    id: int
    workspace_id: int
    active_version: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
