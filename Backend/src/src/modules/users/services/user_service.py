from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils import timezone
from modules.users.dto.user_dto import (
    UserCreateDTO, UserUpdateDTO, UserProfileUpdateDTO
)
from modules.users.repositories.user_repository import UserRepository
from modules.users.entities.user_models import User, UserProfile, UserActivity
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
import logging

logger = logging.getLogger(__name__)


class UserService:
    """Service for user management operations."""
    
    @staticmethod
    def get_users_queryset(requesting_user):
        """Get users queryset based on user permissions."""
        if requesting_user.is_admin:
            return UserRepository.get_all_users()
        elif requesting_user.is_agent:
            # Agents can see all users except admins
            return UserRepository.get_users_excluding_role('admin')
        else:
            # Regular users can only see themselves
            return UserRepository.get_user_by_id(requesting_user.id)
    
    @staticmethod
    def create_user(user_dto: UserCreateDTO, created_by: User) -> dict:
        """Create a new user."""
        try:
            # Check if user already exists
            if UserRepository.user_exists(user_dto.email):
                return {
                    'success': False,
                    'error': 'User already exists',
                    'details': 'A user with this email already exists'
                }
            
            # Validate password
            try:
                validate_password(user_dto.password)
            except ValidationError as e:
                return {
                    'success': False,
                    'error': 'Password validation failed',
                    'details': str(e)
                }
            
            # Create user
            user = UserRepository.create_user(user_dto, created_by)
            
            # Log activity
            UserRepository.log_activity(
                user=user,
                action='user_created',
                description=f'User {user.email} created by {created_by.email}',
                ip_address='system',
                user_agent='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'is_active': user.is_active,
                    'created_at': user.created_at
                }
            }
            
        except Exception as e:
            logger.error(f"User creation service error: {e}")
            return {
                'success': False,
                'error': 'User creation failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_user_by_id(user_id: int) -> dict:
        """Get user by ID."""
        try:
            user = UserRepository.get_user_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'error': 'User not found'
                }
            
            return {
                'success': True,
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'department': user.department,
                    'position': user.position,
                    'employee_id': user.employee_id,
                    'is_active': user.is_active,
                    'is_email_verified': user.is_email_verified,
                    'date_joined': user.date_joined,
                    'last_login': user.last_login,
                    'created_at': user.created_at,
                    'updated_at': user.updated_at
                }
            }
            
        except Exception as e:
            logger.error(f"User retrieval service error: {e}")
            return {
                'success': False,
                'error': 'User retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def update_user(user_id: int, user_dto: UserUpdateDTO, updated_by: User) -> dict:
        """Update user details."""
        try:
            user = UserRepository.get_user_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'error': 'User not found'
                }
            
            # Check permissions
            if not updated_by.is_admin and user_id != updated_by.id:
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'You can only update your own profile'
                }
            
            # Update user
            updated_user = UserRepository.update_user(user, user_dto, updated_by)
            
            # Log activity
            UserRepository.log_activity(
                user=updated_user,
                action='user_updated',
                description=f'User {updated_user.email} updated by {updated_by.email}',
                ip_address='system',
                user_agent='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': updated_user.id,
                    'email': updated_user.email,
                    'first_name': updated_user.first_name,
                    'last_name': updated_user.last_name,
                    'role': updated_user.role,
                    'phone_number': updated_user.phone_number,
                    'department': updated_user.department,
                    'position': updated_user.position,
                    'employee_id': updated_user.employee_id,
                    'is_active': updated_user.is_active,
                    'updated_at': updated_user.updated_at
                }
            }
            
        except Exception as e:
            logger.error(f"User update service error: {e}")
            return {
                'success': False,
                'error': 'User update failed',
                'details': str(e)
            }
    
    @staticmethod
    def delete_user(user_id: int, deleted_by: User) -> dict:
        """Delete a user."""
        try:
            user = UserRepository.get_user_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'error': 'User not found'
                }
            
            # Log activity before deletion
            UserRepository.log_activity(
                user=user,
                action='user_deleted',
                description=f'User {user.email} deleted by {deleted_by.email}',
                ip_address='system',
                user_agent='system'
            )
            
            # Delete user
            UserRepository.delete_user(user)
            
            return {
                'success': True,
                'data': None
            }
            
        except Exception as e:
            logger.error(f"User deletion service error: {e}")
            return {
                'success': False,
                'error': 'User deletion failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_user_profile(user_id: int) -> dict:
        """Get user profile with extended information."""
        try:
            user = UserRepository.get_user_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'error': 'User not found'
                }
            
            profile = UserRepository.get_user_profile(user_id)
            
            profile_data = {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'phone_number': user.phone_number,
                'profile_picture': user.profile_picture.url if user.profile_picture else None,
                'date_of_birth': user.date_of_birth,
                'address': user.address,
                'department': user.department,
                'position': user.position,
                'employee_id': user.employee_id,
                'is_active': user.is_active,
                'is_email_verified': user.is_email_verified,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
                'last_login_ip': user.last_login_ip,
            }
            
            if profile:
                profile_data.update({
                    'bio': profile.bio,
                    'website': profile.website,
                    'linkedin_profile': profile.linkedin_profile,
                    'github_profile': profile.github_profile,
                    'timezone': profile.timezone,
                    'language': profile.language,
                    'theme_preference': profile.theme_preference,
                    'notification_preferences': profile.notification_preferences,
                    'two_factor_enabled': profile.two_factor_enabled,
                })
            
            return {
                'success': True,
                'data': profile_data
            }
            
        except Exception as e:
            logger.error(f"Profile retrieval service error: {e}")
            return {
                'success': False,
                'error': 'Profile retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def update_user_profile(user_id: int, profile_dto: UserProfileUpdateDTO) -> dict:
        """Update user profile."""
        try:
            user = UserRepository.get_user_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'error': 'User not found'
                }
            
            # Update or create profile
            profile = UserRepository.update_user_profile(user_id, profile_dto)
            
            # Log activity
            UserRepository.log_activity(
                user=user,
                action='profile_updated',
                description=f'Profile updated for {user.email}',
                ip_address='system',
                user_agent='system'
            )
            
            return {
                'success': True,
                'data': {
                    'bio': profile.bio,
                    'website': profile.website,
                    'linkedin_profile': profile.linkedin_profile,
                    'github_profile': profile.github_profile,
                    'timezone': profile.timezone,
                    'language': profile.language,
                    'theme_preference': profile.theme_preference,
                    'notification_preferences': profile.notification_preferences,
                }
            }
            
        except Exception as e:
            logger.error(f"Profile update service error: {e}")
            return {
                'success': False,
                'error': 'Profile update failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_user_activities_queryset(user_id: int):
        """Get user activities queryset."""
        return UserRepository.get_user_activities(user_id)
    
    @staticmethod
    def toggle_user_status(user_id: int, toggled_by: User) -> dict:
        """Toggle user active status."""
        try:
            user = UserRepository.get_user_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'error': 'User not found'
                }
            
            # Toggle status
            new_status = not user.is_active
            UserRepository.toggle_user_status(user, new_status)
            
            # Log activity
            action = 'user_activated' if new_status else 'user_deactivated'
            UserRepository.log_activity(
                user=user,
                action=action,
                description=f'User {user.email} {action.replace("_", " ")} by {toggled_by.email}',
                ip_address='system',
                user_agent='system'
            )
            
            return {
                'success': True,
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'is_active': new_status
                }
            }
            
        except Exception as e:
            logger.error(f"Status toggle service error: {e}")
            return {
                'success': False,
                'error': 'Status toggle failed',
                'details': str(e)
            }
    
    @staticmethod
    def search_users(query: str, requesting_user: User) -> dict:
        """Search users by query."""
        try:
            users = UserRepository.search_users(query, requesting_user)
            
            user_list = []
            for user in users:
                user_list.append({
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'department': user.department,
                    'position': user.position,
                    'is_active': user.is_active,
                })
            
            return {
                'success': True,
                'data': user_list
            }
            
        except Exception as e:
            logger.error(f"User search service error: {e}")
            return {
                'success': False,
                'error': 'User search failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_user_statistics(requesting_user: User) -> dict:
        """Get user statistics."""
        try:
            if not requesting_user.is_admin:
                return {
                    'success': False,
                    'error': 'Permission denied',
                    'details': 'Only admins can view user statistics'
                }
            
            stats = UserRepository.get_user_statistics()
            
            return {
                'success': True,
                'data': stats
            }
            
        except Exception as e:
            logger.error(f"User statistics service error: {e}")
            return {
                'success': False,
                'error': 'Failed to get user statistics',
                'details': str(e)
            }
