from celery import current_task
from app.celery import celery_app
from app.services.ml_service import MLService
from app.db.database import SessionLocal
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True)
def process_report_ml(self, report_id: str):
    """Background task to process report with ML analysis."""
    try:
        db = SessionLocal()
        ml_service = MLService()
        
        # Update task state
        self.update_state(
            state='PROGRESS',
            meta={'current': 1, 'total': 4, 'status': 'Starting ML analysis...'}
        )
        
        # Perform ML analysis
        result = ml_service.analyze_report(report_id)
        
        db.close()
        
        return {
            'current': 4,
            'total': 4,
            'status': 'Analysis complete',
            'result': result
        }
        
    except Exception as e:
        logger.error(f"Error in ML processing task: {e}")
        self.update_state(
            state='FAILURE',
            meta={'error': str(e)}
        )
        raise


@celery_app.task(bind=True)
def batch_process_reports(self, report_ids: list):
    """Batch process multiple reports."""
    try:
        total = len(report_ids)
        
        for i, report_id in enumerate(report_ids):
            self.update_state(
                state='PROGRESS',
                meta={'current': i + 1, 'total': total, 'status': f'Processing report {report_id}'}
            )
            
            # Process individual report
            process_report_ml.delay(report_id)
        
        return {'status': 'Batch processing completed'}
        
    except Exception as e:
        logger.error(f"Error in batch processing: {e}")
        raise


@celery_app.task
def cleanup_old_reports():
    """Periodic task to clean up old processed reports."""
    try:
        db = SessionLocal()
        # Implementation would clean up old reports
        db.close()
        return {'status': 'Cleanup completed'}
        
    except Exception as e:
        logger.error(f"Error in cleanup task: {e}")
        raise
