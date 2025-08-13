from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from app.db.database import get_db
from app.core.deps import get_current_admin_user
from app.services.admin_service import AdminService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/queue/status")
async def get_queue_status(
    current_user = Depends(get_current_admin_user)
):
    """Get background job queue status."""
    admin_service = AdminService()
    return await admin_service.get_queue_status()


@router.get("/models")
async def get_model_info(
    current_user = Depends(get_current_admin_user)
):
    """Get ML model information and performance metrics."""
    admin_service = AdminService()
    return await admin_service.get_model_info()


@router.post("/models/retrain")
async def trigger_retrain(
    model_name: str = None,
    current_user = Depends(get_current_admin_user)
):
    """Trigger model retraining."""
    admin_service = AdminService()
    return await admin_service.trigger_retrain(model_name)


@router.get("/reports/stats")
async def get_report_stats(
    days: int = 30,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get detailed report statistics for admin dashboard."""
    admin_service = AdminService()
    return await admin_service.get_report_stats(days, db)


@router.get("/system/health")
async def get_system_health(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive system health information."""
    admin_service = AdminService()
    return await admin_service.get_system_health(db)
