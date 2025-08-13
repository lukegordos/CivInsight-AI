<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CivInsight AI - Project Instructions

This is a real-time civic issue detection and analytics platform that integrates multiple AI technologies for automated civic issue classification and response.

## Architecture Overview
- **Backend**: FastAPI with PostgreSQL+PostGIS for geospatial data
- **ML Pipeline**: Hugging Face models for multimodal analysis (text classification, image captioning, object detection, VQA)
- **Background Processing**: Celery with Redis for async ML processing
- **Frontend**: React with TailwindCSS and Mapbox for interactive dashboards
- **Storage**: S3 for media storage
- **Real-time**: WebSocket connections for live updates

## Key Components
1. **Multimodal ML Pipeline**: Text classification, image-to-text, object detection, visual question answering
2. **Geospatial Processing**: PostGIS for location-based queries and spatial clustering
3. **Real-time Processing**: Async workers for ML inference and notification systems
4. **Public API**: RESTful endpoints for report ingestion and querying
5. **Admin Dashboard**: React interface for monitoring and management

## Development Guidelines
- Use async/await patterns for all database and external API calls
- Implement proper error handling and logging throughout the application
- Follow RESTful API design principles
- Use Pydantic models for data validation
- Implement proper authentication and authorization
- Write comprehensive tests for all endpoints and ML pipelines
- Use type hints throughout the codebase

## ML Integration Notes
- Prioritize Hugging Face Inference API for initial development
- Implement fallback mechanisms for ML service failures
- Cache ML results to avoid redundant processing
- Use confidence thresholds for automated vs. manual review workflows
