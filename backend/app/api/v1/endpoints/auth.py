from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import logging

from app.db.database import get_db
from app.schemas.schemas import UserCreate, UserResponse, Token
from app.services.auth_service import AuthService
from app.core.deps import get_current_user

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)


@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user."""
    auth_service = AuthService(db)
    user = await auth_service.create_user(user_data)
    
    if not user:
        raise HTTPException(status_code=400, detail="User registration failed")
    
    return user


@router.post("/login", response_model=Token)
async def login(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    auth_service = AuthService(db)
    token = await auth_service.authenticate_user(username, password)
    
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return token


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user = Depends(get_current_user)
):
    """Get current user information."""
    return current_user


@router.post("/refresh", response_model=Token)
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Refresh access token."""
    auth_service = AuthService(db)
    token = await auth_service.refresh_token(credentials.credentials)
    
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return token
