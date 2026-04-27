from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out
from modules.users.entities import User
from modules.auth.repositories.auth_repository import AuthRepository
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def user_created(sender, instance, created, **kwargs):
    """Handle user creation signals."""
    if created:
        logger.info(f"New user created: {instance.email}")
        # You can add welcome email logic here
        # send_welcome_email(instance)


@receiver(user_logged_in)
def user_logged_in_handler(sender, request, user, **kwargs):
    """Handle user login signals."""
    ip_address = request.META.get('REMOTE_ADDR')
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    
    # Create login attempt record
    AuthRepository.create_login_attempt(
        email=user.email,
        ip_address=ip_address,
        user_agent=user_agent,
        success=True
    )
    
    # Create user session
    session_key = request.session.session_key or 'unknown'
    AuthRepository.create_user_session(
        user=user,
        session_key=session_key,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    logger.info(f"User logged in: {user.email} from {ip_address}")


@receiver(user_logged_out)
def user_logged_out_handler(sender, request, user, **kwargs):
    """Handle user logout signals."""
    if user:
        # Deactivate user session
        session_key = getattr(request, 'session', {}).get('session_key')
        if session_key:
            AuthRepository.deactivate_user_session(session_key)
        
        logger.info(f"User logged out: {user.email}")


@receiver(post_delete, sender=User)
def user_deleted(sender, instance, **kwargs):
    """Handle user deletion signals."""
    logger.info(f"User deleted: {instance.email}")
    # Clean up related data if needed
