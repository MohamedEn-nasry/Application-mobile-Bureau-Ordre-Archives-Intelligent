from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from modules.users.entities import User

User = get_user_model()


class Archive(models.Model):
    """Archive model for managing archived items."""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('expired', 'Expired'),
        ('deleted', 'Deleted'),
    ]
    
    TYPE_CHOICES = [
        ('mail', 'Mail'),
        ('document', 'Document'),
        ('record', 'Record'),
        ('other', 'Other'),
    ]
    
    RETENTION_CHOICES = [
        ('1_year', '1 Year'),
        ('3_years', '3 Years'),
        ('5_years', '5 Years'),
        ('7_years', '7 Years'),
        ('10_years', '10 Years'),
        ('permanent', 'Permanent'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    archive_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    reference_number = models.CharField(max_length=100, unique=True, help_text='Unique reference number')
    
    # Original item reference
    original_item_id = models.PositiveIntegerField(help_text='ID of the original item')
    original_item_type = models.CharField(max_length=50, help_text='Type of the original item')
    
    # Archive metadata
    archived_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_archives')
    archived_at = models.DateTimeField(auto_now_add=True)
    retention_period = models.CharField(max_length=20, choices=RETENTION_CHOICES)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Status and access
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_public = models.BooleanField(default=False, help_text='Archive is publicly accessible')
    access_level = models.CharField(max_length=20, default='restricted', help_text='Access level for the archive')
    
    # Storage information
    storage_location = models.CharField(max_length=500, help_text='Physical or digital storage location')
    storage_size = models.PositiveIntegerField(default=0, help_text='Storage size in bytes')
    checksum = models.CharField(max_length=64, blank=True, help_text='Archive checksum for integrity')
    
    # Classification
    category = models.CharField(max_length=100, blank=True)
    tags = models.JSONField(default=list, blank=True, help_text='Tags for categorization')
    priority = models.CharField(max_length=20, default='medium', help_text='Archive priority')
    
    # Dates
    original_date = models.DateTimeField(help_text='Original date of the item')
    last_accessed = models.DateTimeField(null=True, blank=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'archives'
        indexes = [
            models.Index(fields=['reference_number']),
            models.Index(fields=['archive_type']),
            models.Index(fields=['status']),
            models.Index(fields=['archived_by']),
            models.Index(fields=['archived_at']),
            models.Index(fields=['expires_at']),
            models.Index(fields=['category']),
            models.Index(fields=['priority']),
        ]
        ordering = ['-archived_at']
    
    def __str__(self):
        return f"{self.reference_number} - {self.title}"
    
    @property
    def is_expired(self):
        """Check if archive is expired."""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def days_until_expiry(self):
        """Get days until expiry."""
        if self.expires_at:
            delta = self.expires_at - timezone.now()
            return delta.days
        return None
    
    @property
    def retention_years(self):
        """Get retention period in years."""
        retention_mapping = {
            '1_year': 1,
            '3_years': 3,
            '5_years': 5,
            '7_years': 7,
            '10_years': 10,
            'permanent': None
        }
        return retention_mapping.get(self.retention_period)


class ArchiveCategory(models.Model):
    """Categories for archive classification."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007bff', help_text='Hex color code')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    retention_policy = models.CharField(max_length=20, choices=Archive.RETENTION_CHOICES)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'archive_categories'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['parent']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name


class ArchiveAccess(models.Model):
    """Access permissions for archives."""
    
    PERMISSION_CHOICES = [
        ('read', 'Read Only'),
        ('write', 'Read/Write'),
        ('admin', 'Admin'),
    ]
    
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='access_permissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.CharField(max_length=20, choices=PERMISSION_CHOICES)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_archive_permissions')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'archive_access'
        unique_together = ['archive', 'user']
        indexes = [
            models.Index(fields=['archive', 'is_active']),
            models.Index(fields=['user', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.permission} - {self.archive.reference_number}"


class ArchiveActivity(models.Model):
    """Activity tracking for archives."""
    
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'archive_activities'
        indexes = [
            models.Index(fields=['archive', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action']),
        ]
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.action} - {self.archive.reference_number}"


class ArchiveComment(models.Model):
    """Comments on archives."""
    
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    is_internal = models.BooleanField(default=True, help_text='Internal comment (not visible to external parties)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'archive_comments'
        indexes = [
            models.Index(fields=['archive', 'created_at']),
            models.Index(fields=['author']),
        ]
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment on {self.archive.reference_number} by {self.author}"


class ArchiveRequest(models.Model):
    """Requests for archive access or retrieval."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    
    TYPE_CHOICES = [
        ('access', 'Access Request'),
        ('retrieval', 'Retrieval Request'),
        ('destruction', 'Destruction Request'),
    ]
    
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='requests')
    request_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='archive_requests')
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Processing information
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='processed_archive_requests')
    processed_at = models.DateTimeField(null=True, blank=True)
    processing_notes = models.TextField(blank=True)
    
    # Dates
    requested_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'archive_requests'
        indexes = [
            models.Index(fields=['archive', 'status']),
            models.Index(fields=['requested_by', 'status']),
            models.Index(fields=['request_type']),
            models.Index(fields=['requested_at']),
        ]
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.request_type} - {self.archive.reference_number}"


class ArchiveDestruction(models.Model):
    """Records of archive destruction."""
    
    archive = models.OneToOneField(Archive, on_delete=models.CASCADE, related_name='destruction')
    destroyed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    destruction_method = models.CharField(max_length=100, help_text='Method used for destruction')
    destruction_reason = models.TextField()
    destruction_date = models.DateTimeField(auto_now_add=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='verified_destructions')
    verified_at = models.DateTimeField(null=True, blank=True)
    certificate_issued = models.BooleanField(default=False)
    certificate_number = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'archive_destructions'
        indexes = [
            models.Index(fields=['archive']),
            models.Index(fields=['destruction_date']),
            models.Index(fields=['destroyed_by']),
        ]
    
    def __str__(self):
        return f"Destruction of {self.archive.reference_number}"


class ArchiveMigration(models.Model):
    """Records of archive migrations (e.g., between storage systems)."""
    
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='migrations')
    from_location = models.CharField(max_length=500)
    to_location = models.CharField(max_length=500)
    migration_reason = models.TextField(blank=True)
    migrated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    migration_date = models.DateTimeField(auto_now_add=True)
    file_size_before = models.PositiveIntegerField(default=0)
    file_size_after = models.PositiveIntegerField(default=0)
    checksum_before = models.CharField(max_length=64, blank=True)
    checksum_after = models.CharField(max_length=64, blank=True)
    status = models.CharField(max_length=20, default='completed')
    
    class Meta:
        db_table = 'archive_migrations'
        indexes = [
            models.Index(fields=['archive']),
            models.Index(fields=['migration_date']),
            models.Index(fields=['status']),
        ]
        ordering = ['-migration_date']
    
    def __str__(self):
        return f"Migration of {self.archive.reference_number}"


class ArchivePolicy(models.Model):
    """Archive policies and retention rules."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    archive_type = models.CharField(max_length=20, choices=Archive.TYPE_CHOICES)
    retention_period = models.CharField(max_length=20, choices=Archive.RETENTION_CHOICES)
    auto_archive = models.BooleanField(default=False, help_text='Automatically archive items')
    auto_delete = models.BooleanField(default=False, help_text='Automatically delete after retention period')
    
    # Policy conditions
    conditions = models.JSONField(default=dict, help_text='Conditions for applying this policy')
    
    # Policy management
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'archive_policies'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['archive_type']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name
