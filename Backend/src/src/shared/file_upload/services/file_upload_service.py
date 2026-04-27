import os
import uuid
import hashlib
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.utils import timezone
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class FileUploadService:
    """Service for handling file uploads and storage operations."""
    
    @staticmethod
    def upload_file(file, folder: str = 'uploads', allowed_extensions: Optional[list] = None, 
                   max_file_size: Optional[int] = None) -> Dict[str, Any]:
        """
        Upload a file to storage.
        
        Args:
            file: The file object to upload
            folder: The folder to store the file in
            allowed_extensions: List of allowed file extensions
            max_file_size: Maximum file size in bytes
            
        Returns:
            Dictionary containing upload result
        """
        try:
            # Validate file
            if not file:
                return {
                    'success': False,
                    'error': 'No file provided',
                    'code': 'no_file'
                }
            
            # Check file size
            if max_file_size and file.size > max_file_size:
                return {
                    'success': False,
                    'error': f'File size exceeds maximum allowed size of {max_file_size} bytes',
                    'code': 'file_too_large'
                }
            
            # Check file extension
            file_extension = FileUploadService.get_file_extension(file.name)
            if allowed_extensions and file_extension not in allowed_extensions:
                return {
                    'success': False,
                    'error': f'File extension {file_extension} is not allowed',
                    'code': 'invalid_extension'
                }
            
            # Generate unique filename
            unique_filename = FileUploadService.generate_unique_filename(file.name)
            file_path = os.path.join(folder, unique_filename)
            
            # Calculate file checksum
            checksum = FileUploadService.calculate_file_checksum(file)
            
            # Save file
            path = default_storage.save(file_path, ContentFile(file.read()))
            
            # Get file URL
            file_url = default_storage.url(path)
            
            # Get file size
            file_size = file.size
            
            return {
                'success': True,
                'data': {
                    'file_path': path,
                    'file_url': file_url,
                    'file_name': file.name,
                    'unique_filename': unique_filename,
                    'file_size': file_size,
                    'file_extension': file_extension,
                    'mime_type': file.content_type,
                    'checksum': checksum,
                    'uploaded_at': timezone.now()
                }
            }
            
        except Exception as e:
            logger.error(f"File upload error: {e}")
            return {
                'success': False,
                'error': 'File upload failed',
                'details': str(e),
                'code': 'upload_error'
            }
    
    @staticmethod
    def delete_file(file_path: str) -> Dict[str, Any]:
        """
        Delete a file from storage.
        
        Args:
            file_path: The path of the file to delete
            
        Returns:
            Dictionary containing deletion result
        """
        try:
            if default_storage.exists(file_path):
                default_storage.delete(file_path)
                return {
                    'success': True,
                    'data': {
                        'file_path': file_path,
                        'deleted_at': timezone.now()
                    }
                }
            else:
                return {
                    'success': False,
                    'error': 'File not found',
                    'code': 'file_not_found'
                }
                
        except Exception as e:
            logger.error(f"File deletion error: {e}")
            return {
                'success': False,
                'error': 'File deletion failed',
                'details': str(e),
                'code': 'deletion_error'
            }
    
    @staticmethod
    def get_file_info(file_path: str) -> Dict[str, Any]:
        """
        Get information about a file.
        
        Args:
            file_path: The path of the file
            
        Returns:
            Dictionary containing file information
        """
        try:
            if not default_storage.exists(file_path):
                return {
                    'success': False,
                    'error': 'File not found',
                    'code': 'file_not_found'
                }
            
            # Get file stats
            file_size = default_storage.size(file_path)
            modified_time = default_storage.modified_time(file_path)
            file_url = default_storage.url(file_path)
            
            return {
                'success': True,
                'data': {
                    'file_path': file_path,
                    'file_url': file_url,
                    'file_size': file_size,
                    'modified_time': modified_time,
                    'exists': True
                }
            }
            
        except Exception as e:
            logger.error(f"File info error: {e}")
            return {
                'success': False,
                'error': 'Failed to get file information',
                'details': str(e),
                'code': 'file_info_error'
            }
    
    @staticmethod
    def generate_unique_filename(original_filename: str) -> str:
        """
        Generate a unique filename.
        
        Args:
            original_filename: The original filename
            
        Returns:
            Unique filename
        """
        # Get file extension
        file_extension = FileUploadService.get_file_extension(original_filename)
        
        # Generate UUID
        unique_id = str(uuid.uuid4())
        
        # Combine to create unique filename
        if file_extension:
            return f"{unique_id}.{file_extension}"
        else:
            return unique_id
    
    @staticmethod
    def get_file_extension(filename: str) -> str:
        """
        Get file extension from filename.
        
        Args:
            filename: The filename
            
        Returns:
            File extension (without dot)
        """
        return filename.split('.')[-1].lower() if '.' in filename else ''
    
    @staticmethod
    def calculate_file_checksum(file) -> str:
        """
        Calculate SHA-256 checksum of file.
        
        Args:
            file: The file object
            
        Returns:
            Hexadecimal checksum
        """
        # Reset file pointer to beginning
        file.seek(0)
        
        # Calculate checksum
        hash_sha256 = hashlib.sha256()
        for chunk in iter(lambda: file.read(4096), b""):
            hash_sha256.update(chunk)
        
        # Reset file pointer to beginning
        file.seek(0)
        
        return hash_sha256.hexdigest()
    
    @staticmethod
    def validate_file_type(file, allowed_types: list) -> Dict[str, Any]:
        """
        Validate file type based on MIME type and extension.
        
        Args:
            file: The file object
            allowed_types: List of allowed MIME types
            
        Returns:
            Dictionary containing validation result
        """
        try:
            # Check MIME type
            if file.content_type not in allowed_types:
                return {
                    'success': False,
                    'error': f'MIME type {file.content_type} is not allowed',
                    'code': 'invalid_mime_type'
                }
            
            # Check file extension
            file_extension = FileUploadService.get_file_extension(file.name)
            mime_extension_mapping = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/gif': 'gif',
                'application/pdf': 'pdf',
                'text/plain': 'txt',
                'application/msword': 'doc',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
                'application/vnd.ms-excel': 'xls',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
                'application/vnd.ms-powerpoint': 'ppt',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            }
            
            expected_extension = mime_extension_mapping.get(file.content_type)
            if expected_extension and file_extension != expected_extension:
                return {
                    'success': False,
                    'error': f'File extension {file_extension} does not match MIME type {file.content_type}',
                    'code': 'extension_mismatch'
                }
            
            return {
                'success': True,
                'data': {
                    'mime_type': file.content_type,
                    'file_extension': file_extension
                }
            }
            
        except Exception as e:
            logger.error(f"File type validation error: {e}")
            return {
                'success': False,
                'error': 'File type validation failed',
                'details': str(e),
                'code': 'validation_error'
            }
    
    @staticmethod
    def create_upload_folder(folder_name: str) -> Dict[str, Any]:
        """
        Create upload folder if it doesn't exist.
        
        Args:
            folder_name: The name of the folder to create
            
        Returns:
            Dictionary containing creation result
        """
        try:
            folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
            
            if not os.path.exists(folder_path):
                os.makedirs(folder_path, exist_ok=True)
                return {
                    'success': True,
                    'data': {
                        'folder_path': folder_path,
                        'created_at': timezone.now()
                    }
                }
            else:
                return {
                    'success': True,
                    'data': {
                        'folder_path': folder_path,
                        'message': 'Folder already exists'
                    }
                }
                
        except Exception as e:
            logger.error(f"Folder creation error: {e}")
            return {
                'success': False,
                'error': 'Failed to create folder',
                'details': str(e),
                'code': 'folder_creation_error'
            }
    
    @staticmethod
    def get_file_size_formatted(size_bytes: int) -> str:
        """
        Format file size in human readable format.
        
        Args:
            size_bytes: File size in bytes
            
        Returns:
            Formatted file size string
        """
        if size_bytes == 0:
            return "0 B"
        
        size_names = ["B", "KB", "MB", "GB", "TB"]
        i = 0
        size = float(size_bytes)
        
        while size >= 1024.0 and i < len(size_names) - 1:
            size /= 1024.0
            i += 1
        
        return f"{size:.1f} {size_names[i]}"
    
    @staticmethod
    def cleanup_temp_files(max_age_hours: int = 24) -> Dict[str, Any]:
        """
        Clean up temporary files older than specified age.
        
        Args:
            max_age_hours: Maximum age in hours before cleanup
            
        Returns:
            Dictionary containing cleanup result
        """
        try:
            temp_folder = os.path.join(settings.MEDIA_ROOT, 'temp')
            
            if not os.path.exists(temp_folder):
                return {
                    'success': True,
                    'data': {
                        'cleaned_files': 0,
                        'message': 'No temp folder found'
                    }
                }
            
            cutoff_time = timezone.now() - timezone.timedelta(hours=max_age_hours)
            cleaned_files = 0
            
            for filename in os.listdir(temp_folder):
                file_path = os.path.join(temp_folder, filename)
                
                if os.path.isfile(file_path):
                    file_modified_time = timezone.make_timestamp(
                        timezone.datetime.fromtimestamp(os.path.getmtime(file_path))
                    )
                    
                    if file_modified_time < cutoff_time:
                        os.remove(file_path)
                        cleaned_files += 1
            
            return {
                'success': True,
                'data': {
                    'cleaned_files': cleaned_files,
                    'cutoff_time': cutoff_time
                }
            }
            
        except Exception as e:
            logger.error(f"Temp files cleanup error: {e}")
            return {
                'success': False,
                'error': 'Failed to cleanup temp files',
                'details': str(e),
                'code': 'cleanup_error'
            }
