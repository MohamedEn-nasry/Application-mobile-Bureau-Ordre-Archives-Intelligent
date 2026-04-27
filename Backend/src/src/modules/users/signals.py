from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out
from modules.users.entities.user_models import User, UserProfile, UserActivity
from modules.users.repositories.user_repository import UserRepository
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def user_created(sender, instance, created, **kwargs):
    """Handle user creation signals."""
    if created:
        # Create user profile if it doesn't exist
        UserProfile.objects.get_or_create(user=instance)
        
        logger.info(f"New user created: {instance.email}")
        
        # Log activity
        UserRepository.log_activity(
            user=instance,
            action='user_created',
            description=f'User {instance.email} created',
            ip_address='system',
            user_agent='system'
        )


@receiver(post_save, sender=User)
def user_updated(sender, instance, created, **kwargs):
    """Handle user update signals."""
    if not created:
        logger.info(f"User updated: {instance.email}")


@receiver(post_delete, sender=User)
def user_deleted(sender, instance, **kwargs):
    """Handle user deletion signals."""
    logger.info(f"User deleted: {instance.email}")


@receiver(user_logged_in)
def user_logged_in_handler(sender, request, user, **kwargs):
    """Handle user login signals."""
    ip_address = request.META.get('REMOTE_ADDR')
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    
    # Update last login
    UserRepository.update_last_login(user, ip_address)
    
    # Log activity
    UserRepository.log_activity(
        user=user,
        action='user_logged_in',
        description=f'User {user.email} logged in',
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    logger.info(f"User logged in: {user.email} from {ip_address}")


@receiver(user_logged_out)
def user_logged_out_handler(sender, request, user, **kwargs):
    """Handle user logout signals."""
    if user:
        # Log activity
        UserRepository.log_activity(
            user=user,
            action='user_logged_out',
            description=f'User {user.email} logged out',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        logger.info(f"User logged out: {user.email}")


@receiver(post_save, sender=UserProfile)
def user_profile_updated(sender, instance, created, **kwargs):
    """Handle user profile update signals."""
    if created:
        logger.info(f"User profile created for: {instance.user.email}")
    else:
        logger.info(f"User profile updated for: {instance.user.email}")
        
        # Log activity
        UserRepository.log_activity(
            user=instance.user,
            action='profile_updated',
            description=f'Profile updated for {instance.user.email}',
            ip_address='system',
            user_agent='system'
        )
