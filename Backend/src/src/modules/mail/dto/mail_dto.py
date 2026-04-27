from dataclasses import dataclass
from typing import Optional, List
from rest_framework import serializers
from modules.users.entities import User


@dataclass
class MailCreateDTO:
    """Data Transfer Object for mail creation."""
    subject: str
    content: str
    mail_type: str = 'incoming'
    priority: str = 'medium'
    status: Optional[str] = 'draft'
    sender: Optional[User] = None
    recipient: Optional[User] = None
    external_sender: Optional[str] = None
    external_recipient: Optional[str] = None
    external_email: Optional[str] = None
    sent_date: Optional[str] = None
    received_date: Optional[str] = None
    due_date: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    
    def __post_init__(self):
        """Validate mail creation data."""
        if not self.subject:
            raise ValueError("Subject is required")
        if not self.content:
            raise ValueError("Content is required")
        
        # Validate mail type
        valid_types = ['incoming', 'outgoing', 'internal']
        if self.mail_type not in valid_types:
            raise ValueError(f"Mail type must be one of: {', '.join(valid_types)}")
        
        # Validate priority
        valid_priorities = ['low', 'medium', 'high', 'urgent']
        if self.priority not in valid_priorities:
            raise ValueError(f"Priority must be one of: {', '.join(valid_priorities)}")
        
        # Validate status
        valid_statuses = ['draft', 'sent', 'received', 'in_progress', 'completed', 'archived']
        if self.status and self.status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
        
        # Validate sender/recipient
        if self.mail_type == 'incoming' and not self.recipient and not self.external_recipient:
            raise ValueError("Recipient is required for incoming mail")
        if self.mail_type == 'outgoing' and not self.sender and not self.external_sender:
            raise ValueError("Sender is required for outgoing mail")


@dataclass
class MailUpdateDTO:
    """Data Transfer Object for mail updates."""
    subject: Optional[str] = None
    content: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    sender: Optional[User] = None
    recipient: Optional[User] = None
    external_sender: Optional[str] = None
    external_recipient: Optional[str] = None
    external_email: Optional[str] = None
    sent_date: Optional[str] = None
    received_date: Optional[str] = None
    due_date: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    
    def __post_init__(self):
        """Validate mail update data."""
        if self.priority is not None:
            valid_priorities = ['low', 'medium', 'high', 'urgent']
            if self.priority not in valid_priorities:
                raise ValueError(f"Priority must be one of: {', '.join(valid_priorities)}")
        
        if self.status is not None:
            valid_statuses = ['draft', 'sent', 'received', 'in_progress', 'completed', 'archived']
            if self.status not in valid_statuses:
                raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")


@dataclass
class MailResponseDTO:
    """Data Transfer Object for mail responses."""
    id: int
    reference_number: str
    subject: str
    content: str
    mail_type: str
    priority: str
    status: str
    sender: Optional[dict]
    recipient: Optional[dict]
    external_sender: Optional[str]
    external_recipient: Optional[str]
    external_email: Optional[str]
    sent_date: Optional[str]
    received_date: Optional[str]
    due_date: Optional[str]
    completed_date: Optional[str]
    notes: Optional[str]
    tags: List[str]
    attachments_count: int
    created_by: Optional[dict]
    created_at: str
    updated_at: str
    last_modified_by: Optional[dict]
    is_overdue: bool
    days_until_due: Optional[int]
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'reference_number': self.reference_number,
            'subject': self.subject,
            'content': self.content,
            'mail_type': self.mail_type,
            'priority': self.priority,
            'status': self.status,
            'sender': self.sender,
            'recipient': self.recipient,
            'external_sender': self.external_sender,
            'external_recipient': self.external_recipient,
            'external_email': self.external_email,
            'sent_date': str(self.sent_date) if self.sent_date else None,
            'received_date': str(self.received_date) if self.received_date else None,
            'due_date': str(self.due_date) if self.due_date else None,
            'completed_date': str(self.completed_date) if self.completed_date else None,
            'notes': self.notes,
            'tags': self.tags,
            'attachments_count': self.attachments_count,
            'created_by': self.created_by,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at),
            'last_modified_by': self.last_modified_by,
            'is_overdue': self.is_overdue,
            'days_until_due': self.days_until_due,
        }


@dataclass
class MailListDTO:
    """Data Transfer Object for mail list items."""
    id: int
    reference_number: str
    subject: str
    status: str
    priority: str
    mail_type: str
    created_at: str
    sender: Optional[str]
    recipient: Optional[str]
    due_date: Optional[str]
    is_overdue: bool
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'reference_number': self.reference_number,
            'subject': self.subject,
            'status': self.status,
            'priority': self.priority,
            'mail_type': self.mail_type,
            'created_at': str(self.created_at),
            'sender': self.sender,
            'recipient': self.recipient,
            'due_date': str(self.due_date) if self.due_date else None,
            'is_overdue': self.is_overdue,
        }


@dataclass
class MailCommentDTO:
    """Data Transfer Object for mail comments."""
    content: str
    is_internal: bool = True
    
    def __post_init__(self):
        """Validate comment data."""
        if not self.content:
            raise ValueError("Comment content is required")


@dataclass
class MailCommentResponseDTO:
    """Data Transfer Object for mail comment responses."""
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
class MailForwardDTO:
    """Data Transfer Object for mail forwarding."""
    forwarded_to: Optional[User] = None
    external_recipient: Optional[str] = None
    external_email: Optional[str] = None
    forward_notes: Optional[str] = None
    
    def __post_init__(self):
        """Validate forward data."""
        if not self.forwarded_to and not self.external_recipient:
            raise ValueError("Either forwarded_to or external_recipient is required")
        
        if self.external_recipient and not self.external_email:
            raise ValueError("External email is required when external recipient is specified")


@dataclass
class MailForwardResponseDTO:
    """Data Transfer Object for mail forward responses."""
    id: int
    forwarded_to: Optional[dict]
    external_recipient: Optional[str]
    external_email: Optional[str]
    forward_notes: Optional[str]
    forwarded_at: str
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'forwarded_to': self.forwarded_to,
            'external_recipient': self.external_recipient,
            'external_email': self.external_email,
            'forward_notes': self.forward_notes,
            'forwarded_at': str(self.forwarded_at),
        }


@dataclass
class MailHistoryDTO:
    """Data Transfer Object for mail history."""
    id: int
    action: str
    description: str
    old_status: Optional[str]
    new_status: Optional[str]
    performed_by: Optional[dict]
    timestamp: str
    ip_address: Optional[str]
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'action': self.action,
            'description': self.description,
            'old_status': self.old_status,
            'new_status': self.new_status,
            'performed_by': self.performed_by,
            'timestamp': str(self.timestamp),
            'ip_address': str(self.ip_address) if self.ip_address else None,
        }


@dataclass
class MailSearchDTO:
    """Data Transfer Object for mail search."""
    query: str
    limit: int = 50
    
    def __post_init__(self):
        """Validate search data."""
        if not self.query:
            raise ValueError("Search query is required")
        if self.limit <= 0 or self.limit > 100:
            raise ValueError("Limit must be between 1 and 100")


@dataclass
class MailStatisticsDTO:
    """Data Transfer Object for mail statistics."""
    total_mails: int
    mails_by_status: List[dict]
    mails_by_priority: List[dict]
    mails_by_type: List[dict]
    mails_last_30_days: int
    overdue_mails: int
    completed_mails: int
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'total_mails': self.total_mails,
            'mails_by_status': self.mails_by_status,
            'mails_by_priority': self.mails_by_priority,
            'mails_by_type': self.mails_by_type,
            'mails_last_30_days': self.mails_last_30_days,
            'overdue_mails': self.overdue_mails,
            'completed_mails': self.completed_mails,
        }


@dataclass
class MailAttachmentDTO:
    """Data Transfer Object for mail attachments."""
    filename: str
    file_path: str
    file_size: int
    file_type: str
    
    def __post_init__(self):
        """Validate attachment data."""
        if not self.filename:
            raise ValueError("Filename is required")
        if not self.file_path:
            raise ValueError("File path is required")
        if self.file_size <= 0:
            raise ValueError("File size must be positive")


@dataclass
class MailCategoryDTO:
    """Data Transfer Object for mail categories."""
    name: str
    description: Optional[str] = None
    color: str = '#007bff'
    
    def __post_init__(self):
        """Validate category data."""
        if not self.name:
            raise ValueError("Category name is required")
        if not self.color.startswith('#'):
            raise ValueError("Color must be a valid hex color code")


# DRF Serializers for API validation
class MailCreateSerializer(serializers.Serializer):
    """DRF serializer for mail creation."""
    subject = serializers.CharField(max_length=255)
    content = serializers.CharField()
    mail_type = serializers.ChoiceField(choices=['incoming', 'outgoing', 'internal'], default='incoming')
    priority = serializers.ChoiceField(choices=['low', 'medium', 'high', 'urgent'], default='medium')
    status = serializers.ChoiceField(
        choices=['draft', 'sent', 'received', 'in_progress', 'completed', 'archived'],
        required=False
    )
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    external_sender = serializers.CharField(max_length=255, required=False, allow_blank=True)
    external_recipient = serializers.CharField(max_length=255, required=False, allow_blank=True)
    external_email = serializers.EmailField(required=False, allow_blank=True)
    sent_date = serializers.DateTimeField(required=False, allow_null=True)
    received_date = serializers.DateTimeField(required=False, allow_null=True)
    due_date = serializers.DateTimeField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    tags = serializers.ListField(child=serializers.CharField(), required=False)


class MailUpdateSerializer(serializers.Serializer):
    """DRF serializer for mail updates."""
    subject = serializers.CharField(max_length=255, required=False)
    content = serializers.CharField(required=False)
    priority = serializers.ChoiceField(choices=['low', 'medium', 'high', 'urgent'], required=False)
    status = serializers.ChoiceField(
        choices=['draft', 'sent', 'received', 'in_progress', 'completed', 'archived'],
        required=False
    )
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    external_sender = serializers.CharField(max_length=255, required=False, allow_blank=True)
    external_recipient = serializers.CharField(max_length=255, required=False, allow_blank=True)
    external_email = serializers.EmailField(required=False, allow_blank=True)
    sent_date = serializers.DateTimeField(required=False, allow_null=True)
    received_date = serializers.DateTimeField(required=False, allow_null=True)
    due_date = serializers.DateTimeField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    tags = serializers.ListField(child=serializers.CharField(), required=False)


class MailCommentSerializer(serializers.Serializer):
    """DRF serializer for mail comments."""
    content = serializers.CharField()
    is_internal = serializers.BooleanField(default=True)


class MailForwardSerializer(serializers.Serializer):
    """DRF serializer for mail forwarding."""
    forwarded_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    external_recipient = serializers.CharField(max_length=255, required=False, allow_blank=True)
    external_email = serializers.EmailField(required=False, allow_blank=True)
    forward_notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        """Validate forward data."""
        if not data.get('forwarded_to') and not data.get('external_recipient'):
            raise serializers.ValidationError("Either forwarded_to or external_recipient is required")
        
        if data.get('external_recipient') and not data.get('external_email'):
            raise serializers.ValidationError("External email is required when external recipient is specified")
        
        return data


class MailAttachmentSerializer(serializers.Serializer):
    """DRF serializer for mail attachments."""
    filename = serializers.CharField(max_length=255)
    file_path = serializers.CharField(max_length=500)
    file_size = serializers.IntegerField(min_value=1)
    file_type = serializers.CharField(max_length=100)


class MailCategorySerializer(serializers.Serializer):
    """DRF serializer for mail categories."""
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, allow_blank=True)
    color = serializers.CharField(max_length=7, default='#007bff')
    
    def validate_color(self, value):
        """Validate color format."""
        if not value.startswith('#'):
            raise serializers.ValidationError("Color must start with '#'")
        return value
