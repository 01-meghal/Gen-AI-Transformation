from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class TransformationConfig(BaseModel):
    audience: Optional[str] = "general"
    tone: Optional[str] = "professional"
    language: Optional[str] = "en"
    detail_level: Optional[str] = "medium"
    objective: Optional[str] = "inform"
    content_style: Optional[str] = "bullet_points"
    brand_profile_id: Optional[int] = None
    length_target: Optional[str] = "medium"
    fact_strictness: Optional[str] = "high"
    custom_instruction: Optional[str] = None

class TransformationRequest(BaseModel):
    targets: List[str]  # e.g., ["executive_summary", "linkedin_post", "twitter_x", "advisory", "infographic_spec", "presentation", "video_package"]
    configuration: Optional[TransformationConfig] = Field(default_factory=TransformationConfig)

class RegenerationRequest(BaseModel):
    instruction: Optional[str] = None
    configuration: Optional[TransformationConfig] = None

class SectionRegenerationRequest(BaseModel):
    base_version_id: int
    section_path: str  # e.g. "key_findings" or "hook"
    instruction: Optional[str] = None
