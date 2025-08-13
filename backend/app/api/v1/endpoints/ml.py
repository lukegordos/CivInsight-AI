from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from app.db.database import get_db
from app.schemas.schemas import MLAnalysisRequest, MLAnalysisResponse
from app.services.ml_service import MLService
from app.core.deps import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/analyze", response_model=MLAnalysisResponse)
async def analyze_content(
    request: MLAnalysisRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Run ML analysis on provided content."""
    ml_service = MLService()
    return await ml_service.analyze_content(request)


@router.get("/models")
async def list_models(
    current_user = Depends(get_current_user)
):
    """List available ML models and their status."""
    ml_service = MLService()
    return await ml_service.get_model_status()


@router.post("/models/{model_name}/test")
async def test_model(
    model_name: str,
    test_data: dict,
    current_user = Depends(get_current_user)
):
    """Test a specific ML model."""
    ml_service = MLService()
    return await ml_service.test_model(model_name, test_data)
