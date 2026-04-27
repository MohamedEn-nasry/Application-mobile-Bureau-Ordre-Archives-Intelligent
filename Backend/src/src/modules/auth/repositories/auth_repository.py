from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from modules.auth.dto.auth_dto import RegisterRequestDTO
from modules.auth.entities.auth_models import (
    RefreshToken, LoginAttempt, PasswordResetToken, 
    EmailVerificationToken, UserSession
)
from modules.users.entities import User
import secrets
import logging

logger = logging.getLogger(__name__)


class AuthRepository:
    """Repository for authentication data operations."""
    
    @staticmethod
    def authenticate_user(email: str, password: str) -> User:
        """Authenticate user with email and password."""
        return authenticate(username=email, password=password)
    
    @staticmethod
    def get_user_by_email(email: str) -> User:
        """Get user by email."""
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def get_user_by_id(user_id: int) -> User:
        """Get user by ID."""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def user_exists(email: str) -> bool:
        """Check if user exists by email."""
        return User.objects.filter(email=email).exists()
    
    @staticmethod
    def create_user(register_dto: RegisterRequestDTO) -> User:
        """Create new user."""
        user = User.objects.create_user(
            email=register_dto.email,
            password=register_dto.password,
            first_name=register_dto.first_name,
            last_name=register_dto.last_name,
            role=register_dto.role or 'lecteur'
        )
        return user
    
    @staticmethod
    def update_last_login(user: User):
        """Update user's last login timestamp."""
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
    
    @staticmethod
    def update_password(user: User, new_password: str):
        """Update user password."""
        user.set_password(new_password)
        user.save(update_fields=['password'])
    
    @staticmethod
    def create_refresh_token(user: User, token: str) -> RefreshToken:
        """Create refresh token record."""
        return RefreshToken.objects.create(
            user=user,
            token=token
        )
    
    @staticmethod
    def revoke_refresh_token(token: str) -> bool:
        """Revoke refresh token."""
        try:
            refresh_token = RefreshToken.objects.get(token=token, is_active=True)
            refresh_token.revoke()
            return True
        except RefreshToken.DoesNotExist:
            return False
    
    @staticmethod
    def create_login_attempt(email: str, ip_address: str, user_agent: str, success: bool, failure_reason: str = None):
        """Create login attempt record."""
        LoginAttempt.objects.create(
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success,
            failure_reason=failure_reason
        )
    
    @staticmethod
    def get_recent_login_attempts(email: str, hours: int = 24) -> list:
        """Get recent login attempts for an email."""
        since = timezone.now() - timedelta(hours=hours)
        return LoginAttempt.objects.filter(
            email=email,
            timestamp__gte=since
        ).order_by('-timestamp')
    
    @staticmethod
    def get_failed_login_attempts(ip_address: str, minutes: int = 15) -> int:
        """Count failed login attempts from IP in time window."""
        since = timezone.now() - timedelta(minutes=minutes)
        return LoginAttempt.objects.filter(
            ip_address=ip_address,
            success=False,
            timestamp__gte=since
        ).count()
    
    @staticmethod
    def create_password_reset_token(user: User) -> PasswordResetToken:
        """Create password reset token."""
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=24)
        
        # Deactivate any existing tokens for this user
        PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)
        
        return PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
    
    @staticmethod
    def get_password_reset_token(token: str) -> PasswordResetToken:
        """Get password reset token."""
        try:
            return PasswordResetToken.objects.get(
                token=token,
                is_used=False
            )
        except PasswordResetToken.DoesNotExist:
            return None
    
    @staticmethod
    def create_email_verification_token(user: User) -> EmailVerificationToken:
        """Create email verification token."""
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=24)
        
        # Deactivate any existing tokens for this user
        EmailVerificationToken.objects.filter(user=user, is_used=False).update(is_used=True)
        
        return EmailVerificationToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
    
    @staticmethod
    def get_email_verification_token(token: str) -> EmailVerificationToken:
        """Get email verification token."""
        try:
            return EmailVerificationToken.objects.get(
                token=token,
                is_used=False
            )
        except EmailVerificationToken.DoesNotExist:
            return None
    
    @staticmethod
    def create_user_session(user: User, session_key: str, ip_address: str, user_agent: str) -> UserSession:
        """Create user session record."""
        return UserSession.objects.create(
            user=user,
            session_key=session_key,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    @staticmethod
    def get_user_session(session_key: str) -> UserSession:
        """Get user session by session key."""
        try:
            return UserSession.objects.get(
                session_key=session_key,
                is_active=True
            )
        except UserSession.DoesNotExist:
            return None
    
    @staticmethod
    def deactivate_user_session(session_key: str) -> bool:
        """Deactivate user session."""
        try:
            session = UserSession.objects.get(session_key=session_key, is_active=True)
            session.deactivate()
            return True
        except UserSession.DoesNotExist:
            return False
    
    @staticmethod
    def get_active_user_sessions(user: User) -> list:
        """Get all active sessions for a user."""
        return UserSession.objects.filter(
            user=user,
            is_active=True
        ).order_by('-last_activity')
    
    @staticmethod
    def deactivate_all_user_sessions(user: User) -> int:
        """Deactivate all sessions for a user."""
        count = UserSession.objects.filter(
            user=user,
            is_active=True
        ).update(is_active=False)
        return count
    
    @staticmethod
    def cleanup_expired_tokens():
        """Clean up expired tokens."""
        now = timezone.now()
        
        # Clean up expired password reset tokens
        expired_password_tokens = PasswordResetToken.objects.filter(
            expires_at__lt=now,
            is_used=False
        )
        password_count = expired_password_tokens.count()
        expired_password_tokens.update(is_used=True)
        
        # Clean up expired email verification tokens
        expired_email_tokens = EmailVerificationToken.objects.filter(
            expires_at__lt=now,
            is_used=False
        )
        email_count = expired_email_tokens.count()
        expired_email_tokens.update(is_used=True)
        
        # Clean up inactive sessions older than 30 days
        thirty_days_ago = now - timedelta(days=30)
        old_sessions = UserSession.objects.filter(
            last_activity__lt=thirty_days_ago,
            is_active=False
        )
        session_count = old_sessions.count()
        old_sessions.delete()
        
        logger.info(f"Cleaned up {password_count} expired password tokens, "
                   f"{email_count} expired email tokens, and {session_count} old sessions")
        
        return {
            'password_tokens': password_count,
            'email_tokens': email_count,
            'sessions': session_count
        }
