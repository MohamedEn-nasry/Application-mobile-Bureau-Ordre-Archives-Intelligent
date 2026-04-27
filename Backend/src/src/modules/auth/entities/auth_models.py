from django.db import models
from django.utils import timezone
from modules.users.entities import User


class RefreshToken(models.Model):
    """Store blacklisted refresh tokens."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refresh_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'auth_refresh_tokens'
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', 'is_active']),
        ]

    def __str__(self):
        return f"RefreshToken for {self.user.email}"

    def revoke(self):
        """Revoke the refresh token."""
        self.is_active = False
        self.revoked_at = timezone.now()
        self.save()


class LoginAttempt(models.Model):
    """Track login attempts for security."""
    email = models.EmailField()
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    success = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)
    failure_reason = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'auth_login_attempts'
        indexes = [
            models.Index(fields=['email', 'timestamp']),
            models.Index(fields=['ip_address', 'timestamp']),
            models.Index(fields=['success', 'timestamp']),
        ]

    def __str__(self):
        return f"LoginAttempt for {self.email} - {'Success' if self.success else 'Failed'}"


class PasswordResetToken(models.Model):
    """Store password reset tokens."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'auth_password_reset_tokens'
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', 'is_used']),
        ]

    def __str__(self):
        return f"PasswordResetToken for {self.user.email}"

    @property
    def is_expired(self):
        """Check if token is expired."""
        return timezone.now() > self.expires_at

    def mark_as_used(self):
        """Mark token as used."""
        self.is_used = True
        self.save()


class EmailVerificationToken(models.Model):
    """Store email verification tokens."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_verification_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'auth_email_verification_tokens'
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', 'is_used']),
        ]

    def __str__(self):
        return f"EmailVerificationToken for {self.user.email}"

    @property
    def is_expired(self):
        """Check if token is expired."""
        return timezone.now() > self.expires_at

    def mark_as_used(self):
        """Mark token as used."""
        self.is_used = True
        self.save()


class UserSession(models.Model):
    """Track active user sessions."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_sessions')
    session_key = models.CharField(max_length=255, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'auth_user_sessions'
        indexes = [
            models.Index(fields=['session_key']),
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['last_activity']),
        ]

    def __str__(self):
        return f"UserSession for {self.user.email}"

    def update_activity(self):
        """Update last activity timestamp."""
        self.last_activity = timezone.now()
        self.save()

    def deactivate(self):
        """Deactivate the session."""
        self.is_active = False
        self.save()
