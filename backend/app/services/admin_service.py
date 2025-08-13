"""
Admin service for administrative operations.
"""

from typing import Dict, List, Any
from sqlalchemy.orm import Session
from app.models.models import Report, User

class AdminService:
    @staticmethod
    def get_system_stats(db: Session) -> Dict[str, Any]:
        """Get system-wide statistics."""
        total_reports = db.query(Report).count()
        total_users = db.query(User).count() if hasattr(db.query(User), 'count') else 0
        
        return {
            "total_reports": total_reports,
            "total_users": total_users,
            "system_status": "operational"
        }
    
    @staticmethod
    def get_report_details(db: Session, report_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific report."""
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return {"error": "Report not found"}
        
        return {
            "id": report.id,
            "title": report.title,
            "status": report.status,
            "created_at": report.created_at.isoformat() if report.created_at else None
        }
