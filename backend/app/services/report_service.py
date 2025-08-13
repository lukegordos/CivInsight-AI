from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging
import asyncio

from app.models.models import Report, Media, MLArtifact, IssueLabel
from app.schemas.schemas import ReportCreate, ReportResponse, ReportQuery, PaginatedResponse
from app.services.ml_service import MLService
from app.services.storage_service import StorageService
from app.services.geocoding_service import GeocodingService

logger = logging.getLogger(__name__)


class ReportService:
    def __init__(self, db: Session):
        self.db = db
        self.ml_service = MLService()
        self.storage_service = StorageService()
        self.geocoding_service = GeocodingService()
    
    async def create_report(self, report_data: ReportCreate, media_files: List = None) -> Report:
        """Create a new report with optional media files."""
        try:
            # Create report record
            report = Report(
                title=report_data.title,
                description=report_data.description,
                user_id=report_data.user_id,
                source=report_data.source.value,
                address=report_data.address
            )
            
            # Handle geolocation
            if report_data.lat and report_data.lon:
                report.geometry = f"POINT({report_data.lon} {report_data.lat})"
            elif report_data.address:
                # Geocode address
                coords = await self.geocoding_service.geocode_address(report_data.address)
                if coords:
                    report.geometry = f"POINT({coords['lon']} {coords['lat']})"
            
            self.db.add(report)
            self.db.commit()
            self.db.refresh(report)
            
            # Process media files if provided
            if media_files:
                await self._process_media_files(report.id, media_files)
            
            logger.info(f"Created report {report.id}")
            return report
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating report: {e}")
            raise
    
    async def get_report(self, report_id: str) -> Optional[ReportResponse]:
        """Get a report by ID with all related data."""
        report = self.db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return None
        
        return self._convert_to_response(report)
    
    async def query_reports(self, query: ReportQuery) -> PaginatedResponse:
        """Query reports with filtering and pagination."""
        db_query = self.db.query(Report)
        
        # Apply filters
        if query.bbox:
            # Parse bbox: "min_lon,min_lat,max_lon,max_lat"
            coords = [float(x) for x in query.bbox.split(',')]
            # Add spatial filter (would need PostGIS functions)
            pass
        
        if query.q:
            # Text search in title and description
            db_query = db_query.filter(
                (Report.title.ilike(f"%{query.q}%")) |
                (Report.description.ilike(f"%{query.q}%"))
            )
        
        if query.issue_type:
            # Filter by issue types
            pass
        
        if query.since:
            db_query = db_query.filter(Report.created_at >= query.since)
        
        if query.until:
            db_query = db_query.filter(Report.created_at <= query.until)
        
        # Get total count
        total = db_query.count()
        
        # Apply pagination
        offset = (query.page - 1) * query.per_page
        reports = db_query.offset(offset).limit(query.per_page).all()
        
        # Convert to response format
        items = [self._convert_to_summary(report) for report in reports]
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=query.page,
            per_page=query.per_page,
            pages=(total + query.per_page - 1) // query.per_page
        )
    
    async def update_status(self, report_id: str, status: str) -> Optional[Report]:
        """Update report status."""
        report = self.db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return None
        
        report.status = status
        if status == "PROCESSED":
            report.processed_at = datetime.utcnow()
        
        self.db.commit()
        return report
    
    async def delete_report(self, report_id: str) -> bool:
        """Delete a report and all related data."""
        report = self.db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return False
        
        # Delete media files from storage
        for media in report.media:
            await self.storage_service.delete_file(media.s3_key)
        
        # Delete from database (cascade will handle related records)
        self.db.delete(report)
        self.db.commit()
        
        return True
    
    async def _process_media_files(self, report_id: str, media_files: List):
        """Process and store media files."""
        for file in media_files:
            try:
                # Upload to storage
                s3_key = await self.storage_service.upload_file(
                    file, f"reports/{report_id}/"
                )
                
                # Create media record
                media = Media(
                    report_id=report_id,
                    s3_key=s3_key,
                    media_type="image" if file.content_type.startswith("image") else "video",
                    file_size=file.size,
                    mime_type=file.content_type
                )
                
                self.db.add(media)
                
            except Exception as e:
                logger.error(f"Error processing media file: {e}")
        
        self.db.commit()
    
    def _convert_to_response(self, report: Report) -> ReportResponse:
        """Convert database model to response schema."""
        # This would include proper conversion logic
        # For now, returning a simplified version
        return ReportResponse(
            id=report.id,
            title=report.title,
            description=report.description,
            status=report.status,
            source=report.source,
            created_at=report.created_at,
            processed_at=report.processed_at
        )
    
    def _convert_to_summary(self, report: Report):
        """Convert to summary format for list views."""
        return {
            "id": report.id,
            "title": report.title,
            "status": report.status,
            "severity_score": report.severity_score,
            "created_at": report.created_at.isoformat()
        }
