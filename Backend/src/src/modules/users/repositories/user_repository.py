from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
from modules.users.dto.user_dto import UserCreateDTO, UserUpdateDTO, UserProfileUpdateDTO
from modules.users.entities.user_models import User, UserProfile, UserActivity, UserPermission
import logging

logger = logging.getLogger(__name__)


class UserRepository:
    """Repository for user data operations."""
    
    @staticmethod
    def get_user_by_id(user_id: int) -> User:
        """Get user by ID."""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def get_user_by_email(email: str) -> User:
        """Get user by email."""
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def user_exists(email: str) -> bool:
        """Check if user exists by email."""
        return User.objects.filter(email=email).exists()
    
    @staticmethod
    def create_user(user_dto: UserCreateDTO, created_by: User) -> User:
        """Create new user."""
        user = User.objects.create_user(
            email=user_dto.email,
            password=user_dto.password,
            first_name=user_dto.first_name,
            last_name=user_dto.last_name,
            role=user_dto.role,
            phone_number=user_dto.phone_number,
            department=user_dto.department,
            position=user_dto.position,
            employee_id=user_dto.employee_id,
        )
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user
    
    @staticmethod
    def update_user(user: User, user_dto: UserUpdateDTO, updated_by: User) -> User:
        """Update user details."""
        # Update fields if provided
        if user_dto.first_name is not None:
            user.first_name = user_dto.first_name
        if user_dto.last_name is not None:
            user.last_name = user_dto.last_name
        if user_dto.phone_number is not None:
            user.phone_number = user_dto.phone_number
        if user_dto.department is not None:
            user.department = user_dto.department
        if user_dto.position is not None:
            user.position = user_dto.position
        if user_dto.employee_id is not None:
            user.employee_id = user_dto.employee_id
        
        # Only admin can change role and status
        if updated_by.is_admin:
            if user_dto.role is not None:
                user.role = user_dto.role
            if user_dto.is_active is not None:
                user.is_active = user_dto.is_active
        
        user.save()
        return user
    
    @staticmethod
    def delete_user(user: User):
        """Delete user."""
        user.delete()
    
    @staticmethod
    def get_all_users():
        """Get all users."""
        return User.objects.all()
    
    @staticmethod
    def get_users_excluding_role(role: str):
        """Get users excluding specific role."""
        return User.objects.exclude(role=role)
    
    @staticmethod
    def get_active_users():
        """Get active users."""
        return User.objects.filter(is_active=True)
    
    @staticmethod
    def get_users_by_role(role: str):
        """Get users by role."""
        return User.objects.filter(role=role)
    
    @staticmethod
    def get_users_by_department(department: str):
        """Get users by department."""
        return User.objects.filter(department=department)
    
    @staticmethod
    def get_user_profile(user_id: int) -> UserProfile:
        """Get user profile."""
        try:
            return UserProfile.objects.get(user_id=user_id)
        except UserProfile.DoesNotExist:
            return None
    
    @staticmethod
    def create_user_profile(user_id: int) -> UserProfile:
        """Create user profile."""
        return UserProfile.objects.create(user_id=user_id)
    
    @staticmethod
    def update_user_profile(user_id: int, profile_dto: UserProfileUpdateDTO) -> UserProfile:
        """Update user profile."""
        profile, created = UserProfile.objects.get_or_create(user_id=user_id)
        
        # Update fields if provided
        if profile_dto.bio is not None:
            profile.bio = profile_dto.bio
        if profile_dto.website is not None:
            profile.website = profile_dto.website
        if profile_dto.linkedin_profile is not None:
            profile.linkedin_profile = profile_dto.linkedin_profile
        if profile_dto.github_profile is not None:
            profile.github_profile = profile_dto.github_profile
        if profile_dto.timezone is not None:
            profile.timezone = profile_dto.timezone
        if profile_dto.language is not None:
            profile.language = profile_dto.language
        if profile_dto.theme_preference is not None:
            profile.theme_preference = profile_dto.theme_preference
        if profile_dto.notification_preferences is not None:
            profile.notification_preferences = profile_dto.notification_preferences
        
        profile.save()
        return profile
    
    @staticmethod
    def log_activity(user: User, action: str, description: str, ip_address: str, user_agent: str):
        """Log user activity."""
        UserActivity.objects.create(
            user=user,
            action=action,
            description=description,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    @staticmethod
    def get_user_activities(user_id: int, limit: int = 50):
        """Get user activities."""
        return UserActivity.objects.filter(user_id=user_id).order_by('-timestamp')[:limit]
    
    @staticmethod
    def get_user_activities_queryset(user_id: int):
        """Get user activities queryset."""
        return UserActivity.objects.filter(user_id=user_id).order_by('-timestamp')
    
    @staticmethod
    def toggle_user_status(user: User, is_active: bool):
        """Toggle user active status."""
        user.is_active = is_active
        user.save(update_fields=['is_active'])
    
    @staticmethod
    def search_users(query: str, requesting_user: User) -> list:
        """Search users by query."""
        queryset = User.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query) |
            Q(employee_id__icontains=query)
        )
        
        # Apply role-based filtering
        if not requesting_user.is_admin:
            if requesting_user.is_agent:
                queryset = queryset.exclude(role='admin')
            else:
                queryset = queryset.filter(id=requesting_user.id)
        
        return queryset[:20]  # Limit results
    
    @staticmethod
    def get_user_statistics() -> dict:
        """Get user statistics."""
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        stats = {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'inactive_users': User.objects.filter(is_active=False).count(),
            'users_by_role': list(
                User.objects.values('role')
                .annotate(count=Count('id'))
                .order_by('role')
            ),
            'users_by_department': list(
                User.objects.values('department')
                .annotate(count=Count('id'))
                .exclude(department='')
                .order_by('-count')
            ),
            'new_users_last_30_days': User.objects.filter(date_joined__gte=thirty_days_ago).count(),
            'active_users_last_30_days': User.objects.filter(
                last_login__gte=thirty_days_ago
            ).count(),
            'email_verified_users': User.objects.filter(is_email_verified=True).count(),
        }
        
        return stats
    
    @staticmethod
    def get_user_permissions(user: User) -> list:
        """Get user custom permissions."""
        permissions = UserPermission.objects.filter(
            user=user,
            is_active=True
        )
        
        # Filter out expired permissions
        active_permissions = []
        for perm in permissions:
            if perm.expires_at is None or perm.expires_at > timezone.now():
                active_permissions.append(perm.permission)
        
        return active_permissions
    
    @staticmethod
    def grant_user_permission(user: User, permission: str, granted_by: User, expires_at=None):
        """Grant permission to user."""
        # Deactivate existing permission if exists
        UserPermission.objects.filter(
            user=user,
            permission=permission,
            is_active=True
        ).update(is_active=False)
        
        # Create new permission
        UserPermission.objects.create(
            user=user,
            permission=permission,
            granted_by=granted_by,
            expires_at=expires_at
        )
    
    @staticmethod
    def revoke_user_permission(user: User, permission: str):
        """Revoke permission from user."""
        UserPermission.objects.filter(
            user=user,
            permission=permission,
            is_active=True
        ).update(is_active=False)
    
    @staticmethod
    def update_last_login(user: User, ip_address: str = None):
        """Update user last login and IP."""
        user.last_login = timezone.now()
        if ip_address:
            user.last_login_ip = ip_address
        user.save(update_fields=['last_login', 'last_login_ip'])
    
    @staticmethod
    def get_users_with_recent_activity(days: int = 7):
        """Get users with recent activity."""
        since = timezone.now() - timedelta(days=days)
        return User.objects.filter(
            Q(last_login__gte=since) | Q(date_joined__gte=since)
        ).distinct()
    
    @staticmethod
    def get_inactive_users(days: int = 90):
        """Get users inactive for specified days."""
        since = timezone.now() - timedelta(days=days)
        return User.objects.filter(
            last_login__lt=since,
            is_active=True
        )
    
    @staticmethod
    def bulk_update_user_status(user_ids: list, is_active: bool, updated_by: User):
        """Bulk update user status."""
        count = User.objects.filter(id__in=user_ids).update(is_active=is_active)
        
        # Log activity for each user
        for user_id in user_ids:
            user = UserRepository.get_user_by_id(user_id)
            if user:
                UserRepository.log_activity(
                    user=user,
                    action='bulk_status_update',
                    description=f'User status updated to {"active" if is_active else "inactive"} by {updated_by.email}',
                    ip_address='system',
                    user_agent='system'
                )
        
        return count
    
    @staticmethod
    def get_user_login_history(user_id: int, days: int = 30):
        """Get user login history."""
        since = timezone.now() - timedelta(days=days)
        return UserActivity.objects.filter(
            user_id=user_id,
            action='user_logged_in',
            timestamp__gte=since
        ).order_by('-timestamp')
    
    @staticmethod
    def cleanup_old_activities(days: int = 90):
        """Clean up old user activities."""
        cutoff = timezone.now() - timedelta(days=days)
        count = UserActivity.objects.filter(timestamp__lt=cutoff).delete()[0]
        logger.info(f"Cleaned up {count} old user activities")
        return count
