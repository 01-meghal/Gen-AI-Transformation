import os
from pathlib import Path
from typing import List, Union

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    # App settings
    PROJECT_NAME: str = "Gen AI Content Transformation Platform"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # CORS
    BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000")
    
    # Database
    # For development, we'll use SQLite. For production, set USE_SQLITE to False and provide PostgreSQL credentials.
    USE_SQLITE: bool = os.getenv("USE_SQLITE", "true").lower() == "true"
    SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", "./content_transformer.db")
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.USE_SQLITE:
            return f"sqlite:///{self.SQLITE_DB_PATH}"
        else:
            # PostgreSQL connection string
            POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
            POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
            POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
            POSTGRES_DB: str = os.getenv("POSTGRES_DB", "content_transformer")
            POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
            return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    
    # Celery
    @property
    def CELERY_BROKER_URL(self) -> str:
        return os.getenv(
            "CELERY_BROKER_URL", 
            f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        )
    
    @property
    def CELERY_RESULT_BACKEND(self) -> str:
        return os.getenv(
            "CELERY_RESULT_BACKEND", 
            f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        )
    
    # AI Providers
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Object Storage (S3/MinIO)
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "content-transformer")
    AWS_S3_ENDPOINT: str = os.getenv("AWS_S3_ENDPOINT", "")  # For MinIO
    
    # File upload limits
    MAX_UPLOAD_SIZE: int = int(os.getenv("MAX_UPLOAD_SIZE", "52428800"))  # 50 MB
    ALLOWED_EXTENSIONS: List[str] = os.getenv("ALLOWED_EXTENSIONS", "txt,md,pdf,docx").split(",")
    
    # Processing limits
    MAX_CHUNK_SIZE: int = int(os.getenv("MAX_CHUNK_SIZE", "1000"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "200"))

settings = Settings()
