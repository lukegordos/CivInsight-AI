import boto3
import asyncio
import aiofiles
import logging
from typing import Optional
from botocore.exceptions import ClientError
import uuid

from app.core.config import settings

logger = logging.getLogger(__name__)


class StorageService:
    """Service for handling file storage operations with AWS S3."""
    
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket = settings.S3_BUCKET
    
    async def upload_file(self, file, prefix: str = "") -> str:
        """Upload file to S3 and return the key."""
        try:
            # Generate unique filename
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
            unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
            s3_key = f"{prefix}{unique_filename}"
            
            # Read file content
            content = await file.read()
            
            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=s3_key,
                Body=content,
                ContentType=file.content_type
            )
            
            logger.info(f"Uploaded file to S3: {s3_key}")
            return s3_key
            
        except Exception as e:
            logger.error(f"Error uploading file to S3: {e}")
            raise
    
    async def delete_file(self, s3_key: str) -> bool:
        """Delete file from S3."""
        try:
            self.s3_client.delete_object(Bucket=self.bucket, Key=s3_key)
            logger.info(f"Deleted file from S3: {s3_key}")
            return True
        except Exception as e:
            logger.error(f"Error deleting file from S3: {e}")
            return False
    
    def get_presigned_url(self, s3_key: str, expiration: int = None) -> str:
        """Generate presigned URL for file access."""
        try:
            expiration = expiration or settings.S3_PRESIGNED_URL_EXPIRATION
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': s3_key},
                ExpiresIn=expiration
            )
            return url
        except Exception as e:
            logger.error(f"Error generating presigned URL: {e}")
            return ""
