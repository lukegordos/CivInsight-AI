from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator
from enum import Enum


class ReportStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    PROCESSED = "PROCESSED"
    FAILED = "FAILED"
    REVIEWED = "REVIEWED"


class ReportSource(str, Enum):
    MOBILE = "MOBILE"
    WEB = "WEB"
    TWITTER = "TWITTER"
    REDDIT = "REDDIT"
    CITY_API = "CITY_API"
    EMAIL = "EMAIL"


class IssueType(str, Enum):
    POTHOLE = "pothole"
    FLOODING = "flooding"
    GRAFFITI = "graffiti"
    BROKEN_LIGHT = "broken_light"
    TRASH = "trash"
    TRAFFIC_ACCIDENT = "traffic_accident"
    DOWNED_WIRE = "downed_wire"
    DAMAGED_SIGN = "damaged_sign"
    DEBRIS = "debris"
    VANDALISM = "vandalism"
    OTHER = "other"


# Pydantic models for API requests/responses
class ReportCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    lat: Optional[float] = Field(None, ge=-90, le=90)
    lon: Optional[float] = Field(None, ge=-180, le=180)
    address: Optional[str] = None
    source: ReportSource = ReportSource.WEB
    user_id: Optional[str] = None


class MediaResponse(BaseModel):
    id: str
    url: str
    thumbnail_url: Optional[str] = None
    media_type: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None

    class Config:
        from_attributes = True


class MLArtifactResponse(BaseModel):
    id: str
    artifact_type: str
    payload: Dict[str, Any]
    model_name: str
    confidence: Optional[float] = None
    processing_time_ms: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class IssueLabelResponse(BaseModel):
    id: str
    label: str
    source: str
    confidence: Optional[float] = None
    is_primary: bool = False

    class Config:
        from_attributes = True


class LocationResponse(BaseModel):
    type: str = "Point"
    coordinates: List[float]  # [longitude, latitude]


class ReportResponse(BaseModel):
    id: str
    title: Optional[str] = None
    description: Optional[str] = None
    status: ReportStatus
    source: ReportSource
    location: Optional[LocationResponse] = None
    address: Optional[str] = None
    severity_score: Optional[float] = None
    confidence_score: Optional[float] = None
    created_at: datetime
    processed_at: Optional[datetime] = None
    
    # Related data
    media: List[MediaResponse] = []
    ml_artifacts: List[MLArtifactResponse] = []
    issue_labels: List[IssueLabelResponse] = []
    
    class Config:
        from_attributes = True


class ReportSummary(BaseModel):
    id: str
    title: Optional[str] = None
    status: ReportStatus
    severity_score: Optional[float] = None
    location: Optional[LocationResponse] = None
    primary_issue: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReportQuery(BaseModel):
    bbox: Optional[str] = None  # "min_lon,min_lat,max_lon,max_lat"
    q: Optional[str] = None  # Text search
    issue_type: Optional[List[IssueType]] = None
    status: Optional[List[ReportStatus]] = None
    min_severity: Optional[float] = Field(None, ge=0, le=10)
    max_severity: Optional[float] = Field(None, ge=0, le=10)
    since: Optional[datetime] = None
    until: Optional[datetime] = None
    page: int = Field(1, ge=1)
    per_page: int = Field(20, ge=1, le=100)


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int


class MLAnalysisRequest(BaseModel):
    text: Optional[str] = None
    media_url: Optional[str] = None
    pipelines: List[str] = Field(default_factory=lambda: ["text_classification"])


class MLAnalysisResponse(BaseModel):
    text_classification: Optional[Dict[str, Any]] = None
    image_caption: Optional[str] = None
    object_detection: Optional[List[Dict[str, Any]]] = None
    vqa_results: Optional[Dict[str, Any]] = None
    processing_time_ms: int
    confidence_scores: Dict[str, float]


class HeatmapPoint(BaseModel):
    lat: float
    lon: float
    intensity: float
    issue_count: int


class AnalyticsResponse(BaseModel):
    total_reports: int
    reports_by_status: Dict[str, int]
    reports_by_type: Dict[str, int]
    avg_severity: float
    processing_time_avg_ms: float
    reports_last_24h: int
    reports_last_7d: int


class NotificationCreate(BaseModel):
    callback_url: str
    filters: Dict[str, Any] = {}
    description: Optional[str] = None


class UserCreate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[str] = None
    scopes: List[str] = []
