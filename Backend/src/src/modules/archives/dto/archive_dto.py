from dataclasses import dataclass
from typing import Optional, List
from rest_framework import serializers
from modules.users.entities import User


@dataclass
class ArchiveCreateDTO:
    """Data Transfer Object for archive creation."""
    title: str
    description: Optional[str] = None
    archive_type: str
    original_item_id: int
    original_item_type: str
    retention_period: str = '7_years'
    is_public: bool = False
    access_level: str = 'restricted'
    storage_location: str
    storage_size: int = 0
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    priority: str = 'medium'
    original_date: str
    
    def __post_init__(self):
        """Validate archive creation data."""
        if not self.title:
            raise ValueError("Title is required")
        if not self.archive_type:
            raise ValueError("Archive type is required")
        if self.original_item_id <= 0:
            raise ValueError("Original item ID must be positive")
        if not self.original_item_type:
            raise ValueError("Original item type is required")
        if not self.storage_location:
            raise ValueError("Storage location is required")
        if not self.original_date:
            raise ValueError("Original date is required")
        
        # Validate archive type
        valid_types = ['mail', 'document', 'record', 'other']
        if self.archive_type not in valid_types:
            raise ValueError(f"Archive type must be one of: {', '.join(valid_types)}")
        
        # Validate retention period
        valid_retention = ['1_year', '3_years', '5_years', '7_years', '10_years', 'permanent']
        if self.retention_period not in valid_retention:
            raise ValueError(f"Retention period must be one of: {', '.join(valid_retention)}")
        
        # Validate access level
        valid_access = ['public', 'restricted', 'confidential']
        if self.access_level not in valid_access:
            raise ValueError(f"Access level must be one of: {', '.join(valid_access)}")
        
        # Validate priority
        valid_priority = ['low', 'medium', 'high', 'urgent']
        if self.priority not in valid_priority:
            raise ValueError(f"Priority must be one of: {', '.join(valid_priority)}")


@dataclass
class ArchiveUpdateDTO:
    """Data Transfer Object for archive updates."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    priority: Optional[str] = None
    is_public: Optional[bool] = None
    access_level: Optional[str] = None
    storage_location: Optional[str] = None
    
    def __post_init__(self):
        """Validate archive update data."""
        if self.status is not None:
            valid_statuses = ['active', 'inactive', 'expired', 'deleted']
            if self.status not in valid_statuses:
                raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
        
        if self.priority is not None:
            valid_priority = ['low', 'medium', 'high', 'urgent']
            if self.priority not in valid_priority:
                raise ValueError(f"Priority must be one of: {', '.join(valid_priority)}")
        
        if self.access_level is not None:
            valid_access = ['public', 'restricted', 'confidential']
            if self.access_level not in valid_access:
                raise ValueError(f"Access level must be one of: {', '.join(valid_access)}")


@dataclass
class ArchiveResponseDTO:
    """Data Transfer Object for archive responses."""
    id: int
    title: str
    description: Optional[str]
    archive_type: str
    reference_number: str
    original_item_id: int
    original_item_type: str
    archived_by: Optional[dict]
    archived_at: str
    retention_period: str
    expires_at: Optional[str]
    status: str
    is_public: bool
    access_level: str
    storage_location: str
    storage_size: int
    checksum: Optional[str]
    category: Optional[str]
    tags: List[str]
    priority: str
    original_date: str
    last_accessed: Optional[str]
    last_modified: str
    is_expired: bool
    days_until_expiry: Optional[int]
    retention_years: Optional[int]
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'archive_type': self.archive_type,
            'reference_number': self.reference_number,
            'original_item_id': self.original_item_id,
            'original_item_type': self.original_item_type,
            'archived_by': self.archived_by,
            'archived_at': str(self.archived_at),
            'retention_period': self.retention_period,
            'expires_at': str(self.expires_at) if self.expires_at else None,
            'status': self.status,
            'is_public': self.is_public,
            'access_level': self.access_level,
            'storage_location': self.storage_location,
            'storage_size': self.storage_size,
            'checksum': self.checksum,
            'category': self.category,
            'tags': self.tags,
            'priority': self.priority,
            'original_date': str(self.original_date),
            'last_accessed': str(self.last_accessed) if self.last_accessed else None,
            'last_modified': str(self.last_modified),
            'is_expired': self.is_expired,
            'days_until_expiry': self.days_until_expiry,
            'retention_years': self.retention_years,
        }


@dataclass
class ArchiveListDTO:
    """Data Transfer Object for archive list items."""
    id: int
    reference_number: str
    title: str
    archive_type: str
    status: str
    archived_at: str
    archived_by: Optional[str]
    expires_at: Optional[str]
    is_expired: bool
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'reference_number': self.reference_number,
            'title': self.title,
            'archive_type': self.archive_type,
            'status': self.status,
            'archived_at': str(self.archived_at),
            'archived_by': self.archived_by,
            'expires_at': str(self.expires_at) if self.expires_at else None,
            'is_expired': self.is_expired,
        }


@dataclass
class ArchiveCommentDTO:
    """Data Transfer Object for archive comments."""
    content: str
    is_internal: bool = True
    
    def __post_init__(self):
        """Validate comment data."""
        if not self.content:
            raise ValueError("Comment content is required")


@dataclass
class ArchiveCommentResponseDTO:
    """Data Transfer Object for archive comment responses."""
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
class ArchiveRequestDTO:
    """Data Transfer Object for archive requests."""
    archive_id: int
    request_type: str
    reason: str
    
    def __post_init__(self):
        """Validate request data."""
        if self.archive_id <= 0:
            raise ValueError("Archive ID must be positive")
        if not self.request_type:
            raise ValueError("Request type is required")
        if not self.reason:
            raise ValueError("Reason is required")
        
        # Validate request type
        valid_types = ['access', 'retrieval', 'destruction']
        if self.request_type not in valid_types:
            raise ValueError(f"Request type must be one of: {', '.join(valid_types)}")


@dataclass
class ArchiveRequestResponseDTO:
    """Data Transfer Object for archive request responses."""
    id: int
    request_type: str
    status: str
    reason: str
    archive_reference: str
    archive_title: str
    requested_at: str
    processed_at: Optional[str]
    processing_notes: Optional[str]
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'request_type': self.request_type,
            'status': self.status,
            'reason': self.reason,
            'archive_reference': self.archive_reference,
            'archive_title': self.archive_title,
            'requested_at': str(self.requested_at),
            'processed_at': str(self.processed_at) if self.processed_at else None,
            'processing_notes': self.processing_notes,
        }


@dataclass
class ArchiveActivityDTO:
    """Data Transfer Object for archive activity."""
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
class ArchiveSearchDTO:
    """Data Transfer Object for archive search."""
    query: str
    limit: int = 50
    
    def __post_init__(self):
        """Validate search data."""
        if not self.query:
            raise ValueError("Search query is required")
        if self.limit <= 0 or self.limit > 100:
            raise ValueError("Limit must be between 1 and 100")


@dataclass
class ArchiveStatisticsDTO:
    """Data Transfer Object for archive statistics."""
    total_archives: int
    archives_by_status: List[dict]
    archives_by_type: List[dict]
    archives_by_retention: List[dict]
    archives_last_30_days: int
    expired_archives: int
    public_archives: int
    total_storage_size: int
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'total_archives': self.total_archives,
            'archives_by_status': self.archives_by_status,
            'archives_by_type': self.archives_by_type,
            'archives_by_retention': self.archives_by_retention,
            'archives_last_30_days': self.archives_last_30_days,
            'expired_archives': self.expired_archives,
            'public_archives': self.public_archives,
            'total_storage_size': self.total_storage_size,
        }


@dataclass
class ArchiveCategoryDTO:
    """Data Transfer Object for archive categories."""
    name: str
    description: Optional[str] = None
    color: str = '#007bff'
    parent_id: Optional[int] = None
    retention_policy: str = '7_years'
    
    def __post_init__(self):
        """Validate category data."""
        if not self.name:
            raise ValueError("Category name is required")
        if not self.color.startswith('#'):
            raise ValueError("Color must be a valid hex color code")
        
        valid_retention = ['1_year', '3_years', '5_years', '7_years', '10_years', 'permanent']
        if self.retention_policy not in valid_retention:
            raise ValueError(f"Retention policy must be one of: {', '.join(valid_retention)}")


@dataclass
class ArchiveAccessDTO:
    """Data Transfer Object for archive access permissions."""
    user_id: int
    permission: str
    expires_at: Optional[str] = None
    
    def __post_init__(self):
        """Validate access data."""
        if self.user_id <= 0:
            raise ValueError("User ID must be positive")
        
        valid_permissions = ['read', 'write', 'admin']
        if self.permission not in valid_permissions:
            raise ValueError(f"Permission must be one of: {', '.join(valid_permissions)}")


# DRF Serializers for API validation
class ArchiveCreateSerializer(serializers.Serializer):
    """DRF serializer for archive creation."""
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    archive_type = serializers.ChoiceField(choices=['mail', 'document', 'record', 'other'])
    original_item_id = serializers.IntegerField(min_value=1)
    original_item_type = serializers.CharField(max_length=50)
    retention_period = serializers.ChoiceField(
        choices=['1_year', '3_years', '5_years', '7_years', '10_years', 'permanent'],
        default='7_years'
    )
    is_public = serializers.BooleanField(default=False)
    access_level = serializers.ChoiceField(
        choices=['public', 'restricted', 'confidential'],
        default='restricted'
    )
    storage_location = serializers.CharField(max_length=500)
    storage_size = serializers.IntegerField(min_value=0, default=0)
    category = serializers.CharField(max_length=100, required=False, allow_blank=True)
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    priority = serializers.ChoiceField(
        choices=['low', 'medium', 'high', 'urgent'],
        default='medium'
    )
    original_date = serializers.DateTimeField()


class ArchiveUpdateSerializer(serializers.Serializer):
    """DRF serializer for archive updates."""
    title = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    status = serializers.ChoiceField(
        choices=['active', 'inactive', 'expired', 'deleted'],
        required=False
    )
    category = serializers.CharField(max_length=100, required=False, allow_blank=True)
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    priority = serializers.ChoiceField(
        choices=['low', 'medium', 'high', 'urgent'],
        required=False
    )
    is_public = serializers.BooleanField(required=False)
    access_level = serializers.ChoiceField(
        choices=['public', 'restricted', 'confidential'],
        required=False
    )
    storage_location = serializers.CharField(max_length=500, required=False, allow_blank=True)


class ArchiveCommentSerializer(serializers.Serializer):
    """DRF serializer for archive comments."""
    content = serializers.CharField()
    is_internal = serializers.BooleanField(default=True)


class ArchiveRequestSerializer(serializers.Serializer):
    """DRF serializer for archive requests."""
    archive_id = serializers.IntegerField(min_value=1)
    request_type = serializers.ChoiceField(choices=['access', 'retrieval', 'destruction'])
    reason = serializers.CharField()


class ArchiveCategorySerializer(serializers.Serializer):
    """DRF serializer for archive categories."""
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, allow_blank=True)
    color = serializers.CharField(max_length=7, default='#007bff')
    parent_id = serializers.IntegerField(required=False, allow_null=True)
    retention_policy = serializers.ChoiceField(
        choices=['1_year', '3_years', '5_years', '7_years', '10_years', 'permanent'],
        default='7_years'
    )
    
    def validate_color(self, value):
        """Validate color format."""
        if not value.startswith('#'):
            raise serializers.ValidationError("Color must start with '#'")
        return value


class ArchiveAccessSerializer(serializers.Serializer):
    """DRF serializer for archive access permissions."""
    user_id = serializers.IntegerField(min_value=1)
    permission = serializers.ChoiceField(choices=['read', 'write', 'admin'])
    expires_at = serializers.DateTimeField(required=False, allow_null=True)
