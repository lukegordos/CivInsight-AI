from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from app.db.database import get_db
from app.schemas.schemas import HeatmapPoint, AnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/heatmap", response_model=List[HeatmapPoint])
async def get_heatmap_data(
    bbox: str = None,  # "min_lon,min_lat,max_lon,max_lat"
    issue_type: str = None,
    days: int = 7,
    db: Session = Depends(get_db)
):
    """Get heatmap data for geographic visualization."""
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_heatmap_data(bbox, issue_type, days)


@router.get("/trends")
async def get_trends(
    period: str = "7d",  # 1d, 7d, 30d, 90d
    group_by: str = "day",  # hour, day, week
    issue_type: str = None,
    db: Session = Depends(get_db)
):
    """Get temporal trend analysis."""
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_trends(period, group_by, issue_type)


@router.get("/summary", response_model=AnalyticsResponse)
async def get_summary(
    db: Session = Depends(get_db)
):
    """Get dashboard summary statistics."""
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_summary()


@router.get("/issue-distribution")
async def get_issue_distribution(
    bbox: str = None,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get issue type distribution."""
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_issue_distribution(bbox, days)


@router.get("/severity-analysis")
async def get_severity_analysis(
    bbox: str = None,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get severity score analysis."""
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_severity_analysis(bbox, days)
