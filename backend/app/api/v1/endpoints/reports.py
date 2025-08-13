from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.db.database import get_db
from app.schemas.schemas import (
    ReportCreate, ReportResponse, ReportSummary, ReportQuery, 
    PaginatedResponse, MLAnalysisResponse
)
from app.services.report_service import ReportService
from app.services.ml_service import MLService
from app.core.deps import get_current_user, get_current_admin_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=dict)
async def create_report(
    background_tasks: BackgroundTasks,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    lat: Optional[float] = Form(None),
    lon: Optional[float] = Form(None),
    address: Optional[str] = Form(None),
    source: str = Form("WEB"),
    user_id: Optional[str] = Form(None),
    media: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db)
):
    """Create a new civic issue report."""
    try:
        report_service = ReportService(db)
        
        # Create report data
        report_data = ReportCreate(
            title=title,
            description=description,
            lat=lat,
            lon=lon,
            address=address,
            source=source,
            user_id=user_id
        )
        
        # Create report
        report = await report_service.create_report(report_data, media)
        
        # Schedule background ML processing
        background_tasks.add_task(process_report_async, report.id, db)
        
        return {
            "report_id": report.id,
            "status": report.status,
            "created_at": report.created_at.isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error creating report: {e}")
        raise HTTPException(status_code=500, detail="Failed to create report")


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: str,
    db: Session = Depends(get_db)
):
    """Get detailed report information."""
    report_service = ReportService(db)
    report = await report_service.get_report(report_id)
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report


@router.get("/", response_model=PaginatedResponse)
async def query_reports(
    query: ReportQuery = Depends(),
    db: Session = Depends(get_db)
):
    """Query reports with filtering and pagination."""
    report_service = ReportService(db)
    return await report_service.query_reports(query)


@router.put("/{report_id}/status")
async def update_report_status(
    report_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update report status (admin only)."""
    report_service = ReportService(db)
    report = await report_service.update_status(report_id, status)
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {"message": "Status updated successfully"}


@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete a report (admin only)."""
    report_service = ReportService(db)
    success = await report_service.delete_report(report_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {"message": "Report deleted successfully"}


async def process_report_async(report_id: str, db: Session):
    """Background task to process report with ML."""
    try:
        ml_service = MLService()
        report_service = ReportService(db)
        
        # Run ML analysis
        await ml_service.analyze_report(report_id)
        
        # Update report status
        await report_service.update_status(report_id, "PROCESSED")
        
        logger.info(f"Successfully processed report {report_id}")
        
    except Exception as e:
        logger.error(f"Error processing report {report_id}: {e}")
        await report_service.update_status(report_id, "FAILED")
