import boto3
import os
from botocore.client import Config
from typing import Optional

class R2Storage:
    def __init__(self):
        self.account_id = os.getenv("R2_ACCOUNT_ID")
        self.access_key_id = os.getenv("R2_ACCESS_KEY_ID")
        self.secret_access_key = os.getenv("R2_SECRET_ACCESS_KEY")
        self.bucket_name = os.getenv("R2_BUCKET_NAME")
        self.public_url = os.getenv("R2_PUBLIC_URL")
        
        self.s3_client = boto3.client(
            "s3",
            endpoint_url=f"https://{self.account_id}.r2.cloudflarestorage.com",
            aws_access_key_id=self.access_key_id,
            aws_secret_access_key=self.secret_access_key,
            config=Config(signature_version="s3v4"),
            region_name="auto",  # R2 uses "auto" for region
        )

    def upload_file(self, local_path: str, r2_key: str) -> str:
        """Uploads a file to R2 and returns the public URL."""
        self.s3_client.upload_file(local_path, self.bucket_name, r2_key)
        return f"{self.public_url}/{r2_key}"

    def download_file(self, r2_key: str, local_path: str):
        """Downloads a file from R2 to a local path."""
        self.s3_client.download_file(self.bucket_name, r2_key, local_path)

    def delete_file(self, r2_key: str):
        """Deletes a file from R2."""
        self.s3_client.delete_object(Bucket=self.bucket_name, Key=r2_key)

    def generate_presigned_url(self, r2_key: str, expiry: int = 3600) -> str:
        """Generates a presigned URL for a file in R2."""
        return self.s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket_name, "Key": r2_key},
            ExpiresIn=expiry,
        )

    def cleanup_temp_files(self, video_id: str):
        """Removes the original temporary video file from R2."""
        r2_key = f"temp/{video_id}/original.mp4"
        try:
            self.delete_file(r2_key)
        except Exception as e:
            print(f"Error cleaning up temp file {r2_key}: {e}")
