from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from modules.auth.dto.auth_dto import (
    LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO,
    ChangePasswordRequestDTO, RefreshTokenRequestDTO
)
from modules.auth.services.auth_service import AuthService
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
from common.guards.auth_guards import IsAuthenticated
import logging

logger = logging.getLogger(__name__)


class LoginView(generics.GenericAPIView):
    """Handle user login."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Authenticate user and return tokens."""
        try:
            login_dto = LoginRequestDTO(**request.data)
            result = AuthService.login(login_dto)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Login successful",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='login_failed'
                    ).to_dict(),
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f"Login error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Login failed",
                    details=str(e),
                    code='login_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RegisterView(generics.GenericAPIView):
    """Handle user registration."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Register new user."""
        try:
            register_dto = RegisterRequestDTO(**request.data)
            result = AuthService.register(register_dto)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Registration successful",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='registration_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Registration error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Registration failed",
                    details=str(e),
                    code='registration_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(generics.GenericAPIView):
    """Handle user logout."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Logout user and blacklist refresh token."""
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response(
                    ErrorResponseDTO(
                        error="Refresh token required",
                        code='refresh_token_required'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            result = AuthService.logout(refresh_token)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Logout successful"
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='logout_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Logout error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Logout failed",
                    details=str(e),
                    code='logout_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RefreshTokenView(generics.GenericAPIView):
    """Handle token refresh."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Refresh access token."""
        try:
            refresh_dto = RefreshTokenRequestDTO(**request.data)
            result = AuthService.refresh_token(refresh_dto.refresh_token)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Token refreshed successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='token_refresh_failed'
                    ).to_dict(),
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Token refresh failed",
                    details=str(e),
                    code='token_refresh_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ChangePasswordView(generics.GenericAPIView):
    """Handle password change."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Change user password."""
        try:
            change_password_dto = ChangePasswordRequestDTO(**request.data)
            change_password_dto.user_id = request.user.id
            
            result = AuthService.change_password(change_password_dto)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Password changed successfully"
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='password_change_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Password change error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Password change failed",
                    details=str(e),
                    code='password_change_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProfileView(generics.GenericAPIView):
    """Get user profile."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user profile."""
        try:
            result = AuthService.get_profile(request.user.id)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Profile retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='profile_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Profile retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Profile retrieval failed",
                    details=str(e),
                    code='profile_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
