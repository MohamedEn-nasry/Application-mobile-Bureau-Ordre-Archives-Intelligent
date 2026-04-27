from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from modules.users.entities import User

User = get_user_model()


class Mail(models.Model):
    """Mail/Courrier model for managing correspondence."""
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('received', 'Received'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    TYPE_CHOICES = [
        ('incoming', 'Incoming'),
        ('outgoing', 'Outgoing'),
        ('internal', 'Internal'),
    ]
    
    reference_number = models.CharField(max_length=50, unique=True, help_text='Unique reference number')
    subject = models.CharField(max_length=255)
    content = models.TextField()
    mail_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='incoming')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Sender and recipient information
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sent_mails')
    recipient = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='received_mails')
    external_sender = models.CharField(max_length=255, blank=True, help_text='External sender name')
    external_recipient = models.CharField(max_length=255, blank=True, help_text='External recipient name')
    external_email = models.EmailField(blank=True, help_text='External email address')
    
    # Dates
    sent_date = models.DateTimeField(null=True, blank=True)
    received_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_mails')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_modified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='modified_mails')
    
    # Additional fields
    notes = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True, help_text='Tags for categorization')
    attachments_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'mails'
        indexes = [
            models.Index(fields=['reference_number']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
            models.Index(fields=['mail_type']),
            models.Index(fields=['sender']),
            models.Index(fields=['recipient']),
            models.Index(fields=['created_at']),
            models.Index(fields=['sent_date']),
            models.Index(fields=['due_date']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.reference_number} - {self.subject}"
    
    @property
    def is_overdue(self):
        """Check if mail is overdue."""
        if self.due_date and self.status not in ['completed', 'archived']:
            return timezone.now() > self.due_date
        return False
    
    @property
    def days_until_due(self):
        """Get days until due date."""
        if self.due_date:
            delta = self.due_date - timezone.now()
            return delta.days
        return None


class MailAttachment(models.Model):
    """Attachments for mail items."""
    
    mail = models.ForeignKey(Mail, on_delete=models.CASCADE, related_name='attachments')
    filename = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_size = models.PositiveIntegerField(help_text='File size in bytes')
    file_type = models.CharField(max_length=100, help_text='MIME type')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mail_attachments'
        indexes = [
            models.Index(fields=['mail']),
            models.Index(fields=['uploaded_at']),
        ]
    
    def __str__(self):
        return f"{self.filename} - {self.mail.reference_number}"


class MailComment(models.Model):
    """Comments and notes on mail items."""
    
    mail = models.ForeignKey(Mail, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    is_internal = models.BooleanField(default=True, help_text='Internal comment (not visible to external parties)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'mail_comments'
        indexes = [
            models.Index(fields=['mail', 'created_at']),
            models.Index(fields=['author']),
        ]
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment on {self.mail.reference_number} by {self.author}"


class MailHistory(models.Model):
    """History tracking for mail items."""
    
    mail = models.ForeignKey(Mail, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=100)
    description = models.TextField()
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    old_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        db_table = 'mail_history'
        indexes = [
            models.Index(fields=['mail', 'timestamp']),
            models.Index(fields=['action']),
            models.Index(fields=['performed_by']),
        ]
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.action} - {self.mail.reference_number}"


class MailCategory(models.Model):
    """Categories for mail classification."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007bff', help_text='Hex color code')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'mail_categories'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name


class MailCategoryAssignment(models.Model):
    """Many-to-many relationship between mails and categories."""
    
    mail = models.ForeignKey(Mail, on_delete=models.CASCADE)
    category = models.ForeignKey(MailCategory, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mail_category_assignments'
        unique_together = ['mail', 'category']
        indexes = [
            models.Index(fields=['mail']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return f"{self.mail.reference_number} - {self.category.name}"


class MailTemplate(models.Model):
    """Templates for creating standardized mails."""
    
    name = models.CharField(max_length=100, unique=True)
    subject_template = models.CharField(max_length=255, help_text='Subject template with placeholders')
    content_template = models.TextField(help_text='Content template with placeholders')
    mail_type = models.CharField(max_length=20, choices=Mail.TYPE_CHOICES)
    priority = models.CharField(max_length=20, choices=Mail.PRIORITY_CHOICES, default='medium')
    tags = models.JSONField(default=list, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'mail_templates'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['mail_type']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name


class MailForward(models.Model):
    """Forwarding records for mail items."""
    
    mail = models.ForeignKey(Mail, on_delete=models.CASCADE, related_name='forwards')
    forwarded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='forwarded_mails')
    forwarded_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='received_forwards')
    external_recipient = models.CharField(max_length=255, blank=True)
    external_email = models.EmailField(blank=True)
    forward_notes = models.TextField(blank=True)
    forwarded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mail_forwards'
        indexes = [
            models.Index(fields=['mail']),
            models.Index(fields=['forwarded_by']),
            models.Index(fields=['forwarded_at']),
        ]
    
    def __str__(self):
        return f"Forwarded: {self.mail.reference_number}"


class MailSignature(models.Model):
    """Digital signatures for mail items."""
    
    mail = models.OneToOneField(Mail, on_delete=models.CASCADE, related_name='signature')
    signed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    signature_data = models.TextField(help_text='Digital signature data')
    signed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    class Meta:
        db_table = 'mail_signatures'
        indexes = [
            models.Index(fields=['mail']),
            models.Index(fields=['signed_by']),
            models.Index(fields=['signed_at']),
        ]
    
    def __str__(self):
        return f"Signature for {self.mail.reference_number}"
