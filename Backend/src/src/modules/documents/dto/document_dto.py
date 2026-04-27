from dataclasses import dataclass
from typing import Optional, List
from rest_framework import serializers
from modules.users.entities import User


@dataclass
class DocumentCreateDTO:
    """Data Transfer Object for document creation."""
    title: str
    description: Optional[str] = None
    file_name: str
    file_path: str
    file_size: int
    file_type: str
    mime_type: str
    document_type: str
    status: Optional[str] = 'draft'
    tags: Optional[List[str]] = None
    expires_at: Optional[str] = None
    notes: Optional[str] = None
    is_public: bool = False
    
    def __post_init__(self):
        """Validate document creation data."""
        if not self.title:
            raise ValueError("Title is required")
        if not self.file_name:
            raise ValueError("File name is required")
        if not self.file_path:
            raise ValueError("File path is required")
        if self.file_size <= 0:
            raise ValueError("File size must be positive")
        
        # Validate document type
        valid_types = ['pdf', 'doc', 'xls', 'ppt', 'img', 'txt', 'other']
        if self.document_type not in valid_types:
            raise ValueError(f"Document type must be one of: {', '.join(valid_types)}")
        
        # Validate status
        valid_statuses = ['draft', 'pending', 'approved', 'rejected', 'archived']
        if self.status and self.status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")


@dataclass
class DocumentUpdateDTO:
    """Data Transfer Object for document updates."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None
    expires_at: Optional[str] = None
    notes: Optional[str] = None
    is_public: Optional[bool] = None
    
    def __post_init__(self):
        """Validate document update data."""
        if self.status is not None:
            valid_statuses = ['draft', 'pending', 'approved', 'rejected', 'archived']
            if self.status not in valid_statuses:
                raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")


@dataclass
class DocumentResponseDTO:
    """Data Transfer Object for document responses."""
    id: int
    title: str
    description: Optional[str]
    file_name: str
    file_path: str
    file_size: int
    file_type: str
    mime_type: str
    document_type: str
    version: int
    status: str
    tags: List[str]
    uploaded_by: Optional[dict]
    reviewed_by: Optional[dict]
    approved_by: Optional[dict]
    uploaded_at: str
    reviewed_at: Optional[str]
    approved_at: Optional[str]
    expires_at: Optional[str]
    notes: Optional[str]
    is_public: bool
    download_count: int
    checksum: str
    is_expired: bool
    file_extension: str
    formatted_file_size: str
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'file_name': self.file_name,
            'file_path': self.file_path,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'mime_type': self.mime_type,
            'document_type': self.document_type,
            'version': self.version,
            'status': self.status,
            'tags': self.tags,
            'uploaded_by': self.uploaded_by,
            'reviewed_by': self.reviewed_by,
            'approved_by': self.approved_by,
            'uploaded_at': str(self.uploaded_at),
            'reviewed_at': str(self.reviewed_at) if self.reviewed_at else None,
            'approved_at': str(self.approved_at) if self.approved_at else None,
            'expires_at': str(self.expires_at) if self.expires_at else None,
            'notes': self.notes,
            'is_public': self.is_public,
            'download_count': self.download_count,
            'checksum': self.checksum,
            'is_expired': self.is_expired,
            'file_extension': self.file_extension,
            'formatted_file_size': self.formatted_file_size,
        }


@dataclass
class DocumentListDTO:
    """Data Transfer Object for document list items."""
    id: int
    title: str
    description: Optional[str]
    document_type: str
    status: str
    uploaded_at: str
    uploaded_by: Optional[str]
    file_size: int
    download_count: int
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'document_type': self.document_type,
            'status': self.status,
            'uploaded_at': str(self.uploaded_at),
            'uploaded_by': self.uploaded_by,
            'file_size': self.file_size,
            'download_count': self.download_count,
        }


@dataclass
class DocumentCommentDTO:
    """Data Transfer Object for document comments."""
    content: str
    is_internal: bool = True
    
    def __post_init__(self):
        """Validate comment data."""
        if not self.content:
            raise ValueError("Comment content is required")


@dataclass
class DocumentCommentResponseDTO:
    """Data Transfer Object for document comment responses."""
    id: int
    content: str
    is_internal: bool
    author: Optional[dict]
    created_at: str
    updated_at: str
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'content': self.content,
            'is_internal': self.is_internal,
            'author': self.author,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at),
        }


@dataclass
class DocumentShareDTO:
    """Data Transfer Object for document sharing."""
    expires_at: Optional[str] = None
    download_limit: Optional[int] = None
    password: Optional[str] = None
    
    def __post_init__(self):
        """Validate share data."""
        if self.download_limit is not None and self.download_limit <= 0:
            raise ValueError("Download limit must be positive")


@dataclass
class DocumentShareResponseDTO:
    """Data Transfer Object for document share responses."""
    id: int
    share_token: str
    expires_at: Optional[str]
    download_limit: Optional[int]
    created_at: str
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'share_token': self.share_token,
            'expires_at': str(self.expires_at) if self.expires_at else None,
            'download_limit': self.download_limit,
            'created_at': str(self.created_at),
        }


@dataclass
class DocumentActivityDTO:
    """Data Transfer Object for document activity."""
    id: int
    action: str
    description: str
    user: Optional[dict]
    timestamp: str
    ip_address: Optional[str]
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'action': self.action,
            'description': self.description,
            'user': self.user,
            'timestamp': str(self.timestamp),
            'ip_address': str(self.ip_address) if self.ip_address else None,
        }


@dataclass
class DocumentSearchDTO:
    """Data Transfer Object for document search."""
    query: str
    limit: int = 50
    
    def __post_init__(self):
        """Validate search data."""
        if not self.query:
            raise ValueError("Search query is required")
        if self.limit <= 0 or self.limit > 100:
            raise ValueError("Limit must be between 1 and 100")


@dataclass
class DocumentStatisticsDTO:
    """Data Transfer Object for document statistics."""
    total_documents: int
    documents_by_status: List[dict]
    documents_by_type: List[dict]
    documents_last_30_days: int
    expired_documents: int
    public_documents: int
    total_downloads: int
    total_file_size: float
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'total_documents': self.total_documents,
            'documents_by_status': self.documents_by_status,
            'documents_by_type': self.documents_by_type,
            'documents_last_30_days': self.documents_last_30_days,
            'expired_documents': self.expired_documents,
            'public_documents': self.public_documents,
            'total_downloads': self.total_downloads,
            'total_file_size': self.total_file_size,
        }


@dataclass
class DocumentCategoryDTO:
    """Data Transfer Object for document categories."""
    name: str
    description: Optional[str] = None
    color: str = '#007bff'
    parent_id: Optional[int] = None
    
    def __post_init__(self):
        """Validate category data."""
        if not self.name:
            raise ValueError("Category name is required")
        if not self.color.startswith('#'):
            raise ValueError("Color must be a valid hex color code")


@dataclass
class DocumentAccessDTO:
    """Data Transfer Object for document access permissions."""
    user_id: int
    permission: str
    expires_at: Optional[str] = None
    
    def __post_init__(self):
        """Validate access data."""
        valid_permissions = ['read', 'write', 'admin']
        if self.permission not in valid_permissions:
            raise ValueError(f"Permission must be one of: {', '.join(valid_permissions)}")


# DRF Serializers for API validation
class DocumentCreateSerializer(serializers.Serializer):
    """DRF serializer for document creation."""
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    file_name = serializers.CharField(max_length=255)
    file_path = serializers.CharField(max_length=500)
    file_size = serializers.IntegerField(min_value=1)
    file_type = serializers.CharField(max_length=20)
    mime_type = serializers.CharField(max_length=100)
    document_type = serializers.ChoiceField(choices=['pdf', 'doc', 'xls', 'ppt', 'img', 'txt', 'other'])
    status = serializers.ChoiceField(
        choices=['draft', 'pending', 'approved', 'rejected', 'archived'],
        required=False
    )
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    expires_at = serializers.DateTimeField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    is_public = serializers.BooleanField(default=False)


class DocumentUpdateSerializer(serializers.Serializer):
    """DRF serializer for document updates."""
    title = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    status = serializers.ChoiceField(
        choices=['draft', 'pending', 'approved', 'rejected', 'archived'],
        required=False
    )
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    expires_at = serializers.DateTimeField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    is_public = serializers.BooleanField(required=False)


class DocumentCommentSerializer(serializers.Serializer):
    """DRF serializer for document comments."""
    content = serializers.CharField()
    is_internal = serializers.BooleanField(default=True)


class DocumentShareSerializer(serializers.Serializer):
    """DRF serializer for document sharing."""
    expires_at = serializers.DateTimeField(required=False, allow_null=True)
    download_limit = serializers.IntegerField(min_value=1, required=False, allow_null=True)
    password = serializers.CharField(required=False, allow_blank=True)


class DocumentCategorySerializer(serializers.Serializer):
    """DRF serializer for document categories."""
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, allow_blank=True)
    color = serializers.CharField(max_length=7, default='#007bff')
    parent_id = serializers.IntegerField(required=False, allow_null=True)
    
    def validate_color(self, value):
        """Validate color format."""
        if not value.startswith('#'):
            raise serializers.ValidationError("Color must start with '#'")
        return value


class DocumentAccessSerializer(serializers.Serializer):
    """DRF serializer for document access permissions."""
    user_id = serializers.IntegerField(min_value=1)
    permission = serializers.ChoiceField(choices=['read', 'write', 'admin'])
    expires_at = serializers.DateTimeField(required=False, allow_null=True)
