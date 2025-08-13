import httpx
import asyncio
import time
import logging
from typing import Dict, Any, List, Optional
from PIL import Image
import io

from app.core.config import settings
from app.schemas.schemas import MLAnalysisRequest, MLAnalysisResponse

logger = logging.getLogger(__name__)


class MLService:
    """Service for handling machine learning operations using Hugging Face models."""
    
    def __init__(self):
        self.api_url = settings.HUGGINGFACE_API_URL
        self.api_token = settings.HUGGINGFACE_API_TOKEN
        self.confidence_threshold = settings.ML_CONFIDENCE_THRESHOLD
        
        # Model configurations
        self.models = {
            "text_classification": "facebook/bart-large-mnli",
            "zero_shot": "facebook/bart-large-mnli", 
            "image_caption": "nlpconnect/vit-gpt2-image-captioning",
            "object_detection": "facebook/detr-resnet-50",
            "vqa": "dandelin/vilt-b32-finetuned-vqa",
            "sentiment": "cardiffnlp/twitter-roberta-base-sentiment-latest"
        }
        
        # Issue classification labels
        self.issue_labels = [
            "pothole", "flooding", "graffiti", "broken streetlight",
            "trash overflow", "traffic accident", "downed power line",
            "damaged road sign", "debris", "vandalism", "other"
        ]
    
    async def analyze_report(self, report_id: str):
        """Analyze a complete report with text and media."""
        # This would fetch the report from database and run analysis
        # Implementation depends on database integration
        pass
    
    async def analyze_content(self, request: MLAnalysisRequest) -> MLAnalysisResponse:
        """Analyze provided content based on requested pipelines."""
        start_time = time.time()
        results = {}
        confidence_scores = {}
        
        try:
            # Run requested ML pipelines
            for pipeline in request.pipelines:
                if pipeline == "text_classification" and request.text:
                    result = await self._classify_text(request.text)
                    results["text_classification"] = result
                    confidence_scores["text_classification"] = result.get("confidence", 0)
                
                elif pipeline == "image_caption" and request.media_url:
                    caption = await self._generate_image_caption(request.media_url)
                    results["image_caption"] = caption
                    confidence_scores["image_caption"] = 0.8  # Default confidence
                
                elif pipeline == "object_detection" and request.media_url:
                    detections = await self._detect_objects(request.media_url)
                    results["object_detection"] = detections
                    confidence_scores["object_detection"] = max(
                        [d.get("confidence", 0) for d in detections], default=0
                    )
                
                elif pipeline == "vqa" and request.media_url:
                    vqa_results = await self._visual_question_answering(
                        request.media_url, request.text or "What issue is shown in this image?"
                    )
                    results["vqa_results"] = vqa_results
                    confidence_scores["vqa"] = vqa_results.get("confidence", 0)
        
        except Exception as e:
            logger.error(f"Error in ML analysis: {e}")
            # Return partial results if some pipelines succeeded
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return MLAnalysisResponse(
            **results,
            processing_time_ms=processing_time,
            confidence_scores=confidence_scores
        )
    
    async def _classify_text(self, text: str) -> Dict[str, Any]:
        """Classify text using zero-shot classification."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/{self.models['zero_shot']}",
                    headers={"Authorization": f"Bearer {self.api_token}"},
                    json={
                        "inputs": text,
                        "parameters": {
                            "candidate_labels": self.issue_labels
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Find best label above confidence threshold
                    best_score = max(result["scores"])
                    best_label = result["labels"][result["scores"].index(best_score)]
                    
                    return {
                        "label": best_label,
                        "confidence": best_score,
                        "all_labels": dict(zip(result["labels"], result["scores"]))
                    }
                else:
                    logger.error(f"Text classification API error: {response.status_code}")
                    return {"label": "other", "confidence": 0.0}
        
        except Exception as e:
            logger.error(f"Text classification error: {e}")
            return {"label": "other", "confidence": 0.0}
    
    async def _generate_image_caption(self, image_url: str) -> str:
        """Generate caption for image."""
        try:
            # Download image
            async with httpx.AsyncClient() as client:
                image_response = await client.get(image_url, timeout=30.0)
                image_data = image_response.content
                
                # Call caption model
                response = await client.post(
                    f"{self.api_url}/{self.models['image_caption']}",
                    headers={"Authorization": f"Bearer {self.api_token}"},
                    data=image_data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result[0]["generated_text"] if result else "Unable to generate caption"
                else:
                    logger.error(f"Image caption API error: {response.status_code}")
                    return "Caption generation failed"
        
        except Exception as e:
            logger.error(f"Image captioning error: {e}")
            return "Caption generation failed"
    
    async def _detect_objects(self, image_url: str) -> List[Dict[str, Any]]:
        """Detect objects in image."""
        try:
            async with httpx.AsyncClient() as client:
                # Download image
                image_response = await client.get(image_url, timeout=30.0)
                image_data = image_response.content
                
                # Call object detection model
                response = await client.post(
                    f"{self.api_url}/{self.models['object_detection']}",
                    headers={"Authorization": f"Bearer {self.api_token}"},
                    data=image_data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    detections = response.json()
                    
                    # Filter detections by confidence threshold
                    filtered_detections = [
                        {
                            "label": det["label"],
                            "confidence": det["score"],
                            "bbox": det["box"]  # {xmin, ymin, xmax, ymax}
                        }
                        for det in detections
                        if det["score"] >= self.confidence_threshold
                    ]
                    
                    return filtered_detections
                else:
                    logger.error(f"Object detection API error: {response.status_code}")
                    return []
        
        except Exception as e:
            logger.error(f"Object detection error: {e}")
            return []
    
    async def _visual_question_answering(self, image_url: str, question: str) -> Dict[str, Any]:
        """Answer questions about image content."""
        try:
            async with httpx.AsyncClient() as client:
                # Download image
                image_response = await client.get(image_url, timeout=30.0)
                image_data = image_response.content
                
                # Call VQA model
                response = await client.post(
                    f"{self.api_url}/{self.models['vqa']}",
                    headers={"Authorization": f"Bearer {self.api_token}"},
                    json={
                        "inputs": {
                            "question": question,
                            "image": image_data.hex()  # Convert to hex for JSON
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "answer": result[0]["answer"],
                        "confidence": result[0]["score"]
                    }
                else:
                    logger.error(f"VQA API error: {response.status_code}")
                    return {"answer": "Unknown", "confidence": 0.0}
        
        except Exception as e:
            logger.error(f"VQA error: {e}")
            return {"answer": "Unknown", "confidence": 0.0}
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get status of all ML models."""
        model_status = {}
        
        for name, model_id in self.models.items():
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"{self.api_url}/{model_id}",
                        headers={"Authorization": f"Bearer {self.api_token}"},
                        timeout=10.0
                    )
                    
                    if response.status_code == 200:
                        model_status[name] = {
                            "status": "available",
                            "model_id": model_id
                        }
                    else:
                        model_status[name] = {
                            "status": "unavailable",
                            "model_id": model_id
                        }
            except Exception as e:
                model_status[name] = {
                    "status": "error",
                    "model_id": model_id,
                    "error": str(e)
                }
        
        return model_status
    
    async def test_model(self, model_name: str, test_data: Dict[str, Any]) -> Dict[str, Any]:
        """Test a specific model with provided data."""
        if model_name not in self.models:
            return {"error": "Model not found"}
        
        try:
            if model_name == "text_classification":
                return await self._classify_text(test_data.get("text", ""))
            elif model_name == "image_caption":
                return {"caption": await self._generate_image_caption(test_data.get("image_url", ""))}
            elif model_name == "object_detection":
                return {"detections": await self._detect_objects(test_data.get("image_url", ""))}
            # Add more model tests as needed
            
        except Exception as e:
            return {"error": str(e)}
