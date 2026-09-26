from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Create SQLAlchemy engine
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    connect_args={"check_same_thread": False} if "sqlite" in settings.SQLALCHEMY_DATABASE_URI else {},  # Needed for SQLite
    pool_pre_ping=True,  # Enable connection health checks
    echo=False  # Set to True for SQL query logging
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models (already defined in app.models.base, but we can re-export or use)
# We'll import Base from app.models.base in other files.

def get_db():
    """
    Dependency function to get DB session.
    Yields a database session and ensures it is closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
