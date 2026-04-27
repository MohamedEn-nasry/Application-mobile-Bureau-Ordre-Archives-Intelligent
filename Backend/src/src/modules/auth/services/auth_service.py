from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from modules.auth.dto.auth_dto import (
    LoginRequestDTO, RegisterRequestDTO, ChangePasswordRequestDTO
)
from modules.auth.repositories.auth_repository import AuthRepository
from modules.users.entities import User
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Authentication service handling all auth operations."""
    
    @staticmethod
    def login(login_dto: LoginRequestDTO) -> dict:
        """Authenticate user and return tokens."""
        try:
            # Authenticate user
            user = authenticate(
                username=login_dto.email,
                password=login_dto.password
            )
            
            if not user:
                return {
                    'success': False,
                    'error': 'Invalid credentials',
                    'details': 'Email or password is incorrect'
                }
            
            if not user.is_active:
                return {
                    'success': False,
                    'error': 'Account disabled',
                    'details': 'Your account has been disabled'
                }
            
            # Generate tokens
            refresh_token = RefreshToken.for_user(user)
            access_token = refresh_token.access_token
            
            # Update last login
            AuthRepository.update_last_login(user)
            
            return {
                'success': True,
                'data': {
                    'access_token': str(access_token),
                    'refresh_token': str(refresh_token),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'role': user.role,
                        'is_active': user.is_active
                    }
                }
            }
            
        except Exception as e:
            logger.error(f"Login service error: {e}")
            return {
                'success': False,
                'error': 'Login failed',
                'details': str(e)
            }
    
    @staticmethod
    def register(register_dto: RegisterRequestDTO) -> dict:
        """Register new user."""
        try:
            # Check if user already exists
            if AuthRepository.user_exists(register_dto.email):
                return {
                    'success': False,
                    'error': 'User already exists',
                    'details': 'A user with this email already exists'
                }
            
            # Validate password
            try:
                validate_password(register_dto.password)
            except Exception as e:
                return {
                    'success': False,
                    'error': 'Password validation failed',
                    'details': str(e)
                }
            
            # Create user
            user = AuthRepository.create_user(register_dto)
            
            # Generate tokens
            refresh_token = RefreshToken.for_user(user)
            access_token = refresh_token.access_token
            
            return {
                'success': True,
                'data': {
                    'access_token': str(access_token),
                    'refresh_token': str(refresh_token),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'role': user.role,
                        'is_active': user.is_active
                    }
                }
            }
            
        except Exception as e:
            logger.error(f"Registration service error: {e}")
            return {
                'success': False,
                'error': 'Registration failed',
                'details': str(e)
            }
    
    @staticmethod
    def logout(refresh_token: str) -> dict:
        """Logout user by blacklisting refresh token."""
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return {
                'success': True,
                'data': None
            }
            
        except TokenError as e:
            logger.error(f"Token error during logout: {e}")
            return {
                'success': False,
                'error': 'Invalid token',
                'details': 'The provided refresh token is invalid or expired'
            }
        except Exception as e:
            logger.error(f"Logout service error: {e}")
            return {
                'success': False,
                'error': 'Logout failed',
                'details': str(e)
            }
    
    @staticmethod
    def refresh_token(refresh_token: str) -> dict:
        """Refresh access token."""
        try:
            token = RefreshToken(refresh_token)
            access_token = token.access_token
            
            return {
                'success': True,
                'data': {
                    'access_token': str(access_token),
                    'refresh_token': str(token)  # Return same refresh token
                }
            }
            
        except TokenError as e:
            logger.error(f"Token refresh error: {e}")
            return {
                'success': False,
                'error': 'Invalid refresh token',
                'details': 'The provided refresh token is invalid or expired'
            }
        except Exception as e:
            logger.error(f"Token refresh service error: {e}")
            return {
                'success': False,
                'error': 'Token refresh failed',
                'details': str(e)
            }
    
    @staticmethod
    def change_password(change_password_dto: ChangePasswordRequestDTO) -> dict:
        """Change user password."""
        try:
            # Get user
            user = AuthRepository.get_user_by_id(change_password_dto.user_id)
            if not user:
                return {
                    'success': False,
                    'error': 'User not found',
                    'details': 'The specified user does not exist'
                }
            
            # Verify current password
            if not user.check_password(change_password_dto.current_password):
                return {
                    'success': False,
                    'error': 'Invalid current password',
                    'details': 'The current password you entered is incorrect'
                }
            
            # Validate new password
            try:
                validate_password(change_password_dto.new_password, user=user)
            except Exception as e:
                return {
                    'success': False,
                    'error': 'Password validation failed',
                    'details': str(e)
                }
            
            # Update password
            AuthRepository.update_password(user, change_password_dto.new_password)
            
            return {
                'success': True,
                'data': None
            }
            
        except Exception as e:
            logger.error(f"Password change service error: {e}")
            return {
                'success': False,
                'error': 'Password change failed',
                'details': str(e)
            }
    
    @staticmethod
    def get_profile(user_id: int) -> dict:
        """Get user profile."""
        try:
            user = AuthRepository.get_user_by_id(user_id)
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
                    'is_active': user.is_active,
                    'date_joined': user.date_joined,
                    'last_login': user.last_login
                }
            }
            
        except Exception as e:
            logger.error(f"Profile service error: {e}")
            return {
                'success': False,
                'error': 'Profile retrieval failed',
                'details': str(e)
            }
    
    @staticmethod
    def verify_token(access_token: str) -> dict:
        """Verify access token and return user info."""
        try:
            token = AccessToken(access_token)
            user_id = token['user_id']
            user = AuthRepository.get_user_by_id(user_id)
            
            if not user or not user.is_active:
                return {
                    'success': False,
                    'error': 'Invalid token',
                    'details': 'User not found or inactive'
                }
            
            return {
                'success': True,
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'role': user.role
                }
            }
            
        except TokenError as e:
            logger.error(f"Token verification error: {e}")
            return {
                'success': False,
                'error': 'Invalid token',
                'details': 'The provided access token is invalid or expired'
            }
        except Exception as e:
            logger.error(f"Token verification service error: {e}")
            return {
                'success': False,
                'error': 'Token verification failed',
                'details': str(e)
            }
