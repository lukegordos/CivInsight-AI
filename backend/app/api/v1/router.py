from fastapi import APIRouter
from app.api.v1.endpoints import reports, analytics, ml, admin, auth

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(ml.router, prefix="/ml", tags=["machine-learning"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
