from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from modules.users.entities import User

User = get_user_model()


class Document(models.Model):
    """Document model for managing files and documents."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('archived', 'Archived'),
    ]
    
    TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('doc', 'Word Document'),
        ('xls', 'Excel Spreadsheet'),
        ('ppt', 'PowerPoint Presentation'),
        ('img', 'Image'),
        ('txt', 'Text File'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_size = models.PositiveIntegerField(help_text='File size in bytes')
    file_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    mime_type = models.CharField(max_length=100)
    document_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    # Metadata
    version = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    tags = models.JSONField(default=list, blank=True, help_text='Tags for categorization')
    
    # Relationships
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reviewed_documents')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='approved_documents')
    
    # Dates
    uploaded_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Additional fields
    notes = models.TextField(blank=True)
    is_public = models.BooleanField(default=False, help_text='Document is publicly accessible')
    download_count = models.PositiveIntegerField(default=0)
    checksum = models.CharField(max_length=64, help_text='File checksum for integrity verification')
    
    class Meta:
        db_table = 'documents'
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['status']),
            models.Index(fields=['document_type']),
            models.Index(fields=['uploaded_by']),
            models.Index(fields=['uploaded_at']),
            models.Index(fields=['expires_at']),
            models.Index(fields=['is_public']),
        ]
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.title} v{self.version}"
    
    @property
    def is_expired(self):
        """Check if document is expired."""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def file_extension(self):
        """Get file extension."""
        return self.file_name.split('.')[-1].lower() if '.' in self.file_name else ''
    
    @property
    def formatted_file_size(self):
        """Get formatted file size."""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if self.file_size < 1024.0:
                return f"{self.file_size:.1f} {unit}"
            self.file_size /= 1024.0
        return f"{self.file_size:.1f} TB"


class DocumentVersion(models.Model):
    """Document versions for tracking changes."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    version_number = models.PositiveIntegerField()
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_size = models.PositiveIntegerField()
    checksum = models.CharField(max_length=64)
    change_notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_current = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'document_versions'
        unique_together = ['document', 'version_number']
        indexes = [
            models.Index(fields=['document', 'version_number']),
            models.Index(fields=['created_by']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-version_number']
    
    def __str__(self):
        return f"{self.document.title} v{self.version_number}"


class DocumentCategory(models.Model):
    """Categories for document classification."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007bff', help_text='Hex color code')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'document_categories'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['parent']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name


class DocumentCategoryAssignment(models.Model):
    """Many-to-many relationship between documents and categories."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    category = models.ForeignKey(DocumentCategory, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'document_category_assignments'
        unique_together = ['document', 'category']
        indexes = [
            models.Index(fields=['document']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return f"{self.document.title} - {self.category.name}"


class DocumentAccess(models.Model):
    """Document access permissions."""
    
    PERMISSION_CHOICES = [
        ('read', 'Read Only'),
        ('write', 'Read/Write'),
        ('admin', 'Admin'),
    ]
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='access_permissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.CharField(max_length=20, choices=PERMISSION_CHOICES)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_permissions')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'document_access'
        unique_together = ['document', 'user']
        indexes = [
            models.Index(fields=['document', 'is_active']),
            models.Index(fields=['user', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.permission} - {self.document.title}"


class DocumentActivity(models.Model):
    """Activity tracking for documents."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'document_activities'
        indexes = [
            models.Index(fields=['document', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action']),
        ]
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.action} - {self.document.title}"


class DocumentComment(models.Model):
    """Comments on documents."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    is_internal = models.BooleanField(default=True, help_text='Internal comment (not visible to external parties)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'document_comments'
        indexes = [
            models.Index(fields=['document', 'created_at']),
            models.Index(fields=['author']),
        ]
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment on {self.document.title} by {self.author}"


class DocumentShare(models.Model):
    """Document sharing links."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='shares')
    share_token = models.CharField(max_length=64, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    download_limit = models.PositiveIntegerField(null=True, blank=True)
    download_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    password = models.CharField(max_length=255, blank=True, help_text='Optional password protection')
    
    class Meta:
        db_table = 'document_shares'
        indexes = [
            models.Index(fields=['share_token']),
            models.Index(fields=['document']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"Share link for {self.document.title}"
    
    @property
    def is_expired(self):
        """Check if share link is expired."""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def is_download_limit_reached(self):
        """Check if download limit is reached."""
        return self.download_limit and self.download_count >= self.download_limit


class DocumentTemplate(models.Model):
    """Templates for creating standardized documents."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    template_file = models.CharField(max_length=500, help_text='Path to template file')
    document_type = models.CharField(max_length=20, choices=Document.TYPE_CHOICES)
    default_tags = models.JSONField(default=list, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'document_templates'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['document_type']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name


class DocumentSignature(models.Model):
    """Digital signatures for documents."""
    
    document = models.OneToOneField(Document, on_delete=models.CASCADE, related_name='signature')
    signed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    signature_data = models.TextField(help_text='Digital signature data')
    signed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    is_valid = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'document_signatures'
        indexes = [
            models.Index(fields=['document']),
            models.Index(fields=['signed_by']),
            models.Index(fields=['signed_at']),
        ]
    
    def __str__(self):
        return f"Signature for {self.document.title}"
