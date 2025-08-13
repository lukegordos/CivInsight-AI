import os
from typing import Any, Dict, List, Optional, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Environment
    NODE_ENV: str = "development"
    
    # Project info
    PROJECT_NAME: str = "CivInsight AI"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/v1"
    
    # Server
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = False
    
    # Database
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = ""
    DATABASE_NAME: str = "civinsight_ai"
    DATABASE_URL: Optional[str] = None

    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_connection(cls, v: Optional[str], info) -> Any:
        if isinstance(v, str):
            return v
        values = info.data if hasattr(info, 'data') else {}
        return f"postgresql://{values.get('DATABASE_USER', 'postgres')}:{values.get('DATABASE_PASSWORD', '')}@{values.get('DATABASE_HOST', 'localhost')}:{values.get('DATABASE_PORT', 5432)}/{values.get('DATABASE_NAME', 'civinsight_ai')}"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    ALLOWED_ORIGINS: str = '["http://localhost:3000", "http://localhost:3001"]'
    ALLOWED_CREDENTIALS: bool = True
    ALLOWED_METHODS: str = '["*"]'
    ALLOWED_HEADERS: str = '["*"]'

    # AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: Optional[str] = None
    S3_PRESIGNED_URL_EXPIRATION: int = 3600
    
    # Hugging Face
    HUGGINGFACE_API_TOKEN: Optional[str] = None
    HUGGINGFACE_API_URL: str = "https://api-inference.huggingface.co/models"
    
    # External APIs
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    TWITTER_BEARER_TOKEN: Optional[str] = None
    
    # ML Configuration
    ML_CONFIDENCE_THRESHOLD: float = 0.7
    IMAGE_MAX_SIZE: int = 10485760  # 10MB
    VIDEO_MAX_SIZE: int = 104857600  # 100MB
    BATCH_SIZE: int = 32
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60
    RATE_LIMIT_BURST: int = 10
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
