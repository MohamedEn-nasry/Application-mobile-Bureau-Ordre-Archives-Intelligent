from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from django.contrib.auth.validators import UnicodeUsernameValidator


class User(AbstractUser):
    """Custom user model with additional fields."""
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('agent', 'Agent'),
        ('lecteur', 'Lecteur'),
    ]
    
    username = None  # Remove username field
    email = models.EmailField(unique=True, verbose_name='Email address')
    first_name = models.CharField(max_length=150, verbose_name='First name')
    last_name = models.CharField(max_length=150, verbose_name='Last name')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='lecteur')
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ]
    )
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        help_text='Profile picture image'
    )
    is_email_verified = models.BooleanField(default=False)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    department = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    employee_id = models.CharField(max_length=50, blank=True, unique=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = models.Manager()
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
            models.Index(fields=['date_joined']),
            models.Index(fields=['last_login']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        """Get user's full name."""
        return f"{self.first_name} {self.last_name}".strip()
    
    @property
    def is_admin(self):
        """Check if user is admin."""
        return self.role == 'admin'
    
    @property
    def is_agent(self):
        """Check if user is agent."""
        return self.role == 'agent'
    
    @property
    def is_lecteur(self):
        """Check if user is lecteur."""
        return self.role == 'lecteur'
    
    def get_role_display_name(self):
        """Get display name for role."""
        role_display = dict(self.ROLE_CHOICES).get(self.role, self.role)
        return role_display
    
    def has_permission(self, permission):
        """Check if user has specific permission."""
        # Implement permission logic based on role
        if self.is_admin:
            return True  # Admin has all permissions
        
        # Define role-based permissions
        role_permissions = {
            'agent': ['read_mail', 'create_mail', 'update_mail', 'read_documents'],
            'lecteur': ['read_mail', 'read_documents'],
        }
        
        return permission in role_permissions.get(self.role, [])


class UserProfile(models.Model):
    """Extended user profile information."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    linkedin_profile = models.URLField(blank=True)
    github_profile = models.URLField(blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    theme_preference = models.CharField(
        max_length=20,
        choices=[
            ('light', 'Light'),
            ('dark', 'Dark'),
            ('auto', 'Auto'),
        ],
        default='light'
    )
    notification_preferences = models.JSONField(
        default=dict,
        help_text='User notification preferences'
    )
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=255, blank=True)
    backup_codes = models.JSONField(default=list, blank=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"Profile for {self.user.email}"


class UserActivity(models.Model):
    """Track user activity."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_activities'
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.action} at {self.timestamp}"


class UserPermission(models.Model):
    """Custom user permissions."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='permissions')
    permission = models.CharField(max_length=100)
    granted_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='granted_permissions'
    )
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'user_permissions'
        unique_together = ['user', 'permission']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['permission']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.permission}"
    
    @property
    def is_expired(self):
        """Check if permission is expired."""
        if self.expires_at is None:
            return False
        return timezone.now() > self.expires_at


class UserGroup(models.Model):
    """User groups for role-based access control."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=list, help_text='List of permissions')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='created_groups'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'user_groups'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name


class UserGroupMembership(models.Model):
    """User group memberships."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_memberships')
    group = models.ForeignKey(UserGroup, on_delete=models.CASCADE, related_name='user_memberships')
    joined_at = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='added_memberships'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'user_group_memberships'
        unique_together = ['user', 'group']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['group', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.group.name}"
