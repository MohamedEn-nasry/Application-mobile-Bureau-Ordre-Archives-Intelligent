from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from modules.users.dto.user_dto import (
    UserCreateDTO, UserUpdateDTO, UserResponseDTO, UserListDTO,
    UserProfileUpdateDTO, UserPasswordChangeDTO
)
from modules.users.services.user_service import UserService
from common.dto.response_dto import SuccessResponseDTO, ErrorResponseDTO
from common.guards.auth_guards import IsAdminUser, IsAgent
from common.dto.pagination_dto import CustomPagination
import logging

logger = logging.getLogger(__name__)


class UserListView(generics.ListAPIView):
    """List all users (admin/agent only)."""
    permission_classes = [IsAuthenticated, IsAgent]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'employee_id']
    filterset_fields = ['role', 'is_active', 'department']
    ordering_fields = ['created_at', 'last_login', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get filtered queryset of users."""
        return UserService.get_users_queryset(self.request.user)
    
    def list(self, request, *args, **kwargs):
        """List users with pagination."""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            
            if page is not None:
                serializer = UserListDTO(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = UserListDTO(queryset, many=True)
            return Response(
                SuccessResponseDTO(
                    message="Users retrieved successfully",
                    data=serializer.data
                ).to_dict(),
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"User list error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Failed to retrieve users",
                    details=str(e),
                    code='user_list_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserCreateView(generics.CreateAPIView):
    """Create new user (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request):
        """Create a new user."""
        try:
            user_dto = UserCreateDTO(**request.data)
            result = UserService.create_user(user_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="User created successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='user_creation_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"User creation error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="User creation failed",
                    details=str(e),
                    code='user_creation_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserDetailView(generics.RetrieveUpdateAPIView):
    """Get, update user details."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id=None):
        """Get user details."""
        try:
            target_user_id = user_id or request.user.id
            
            # Check permissions for viewing other users
            if target_user_id != request.user.id and not request.user.is_admin:
                return Response(
                    ErrorResponseDTO(
                        error="Permission denied",
                        details="You can only view your own profile",
                        code='permission_denied'
                    ).to_dict(),
                    status=status.HTTP_403_FORBIDDEN
                )
            
            result = UserService.get_user_by_id(target_user_id)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="User retrieved successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='user_not_found'
                    ).to_dict(),
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"User retrieval error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="User retrieval failed",
                    details=str(e),
                    code='user_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, user_id=None):
        """Update user details."""
        try:
            target_user_id = user_id or request.user.id
            
            # Check permissions for updating other users
            if target_user_id != request.user.id and not request.user.is_admin:
                return Response(
                    ErrorResponseDTO(
                        error="Permission denied",
                        details="You can only update your own profile",
                        code='permission_denied'
                    ).to_dict(),
                    status=status.HTTP_403_FORBIDDEN
                )
            
            user_dto = UserUpdateDTO(**request.data)
            result = UserService.update_user(target_user_id, user_dto, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="User updated successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='user_update_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"User update error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="User update failed",
                    details=str(e),
                    code='user_update_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserDeleteView(generics.DestroyAPIView):
    """Delete user (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def delete(self, request, user_id):
        """Delete a user."""
        try:
            if user_id == request.user.id:
                return Response(
                    ErrorResponseDTO(
                        error="Cannot delete yourself",
                        code='self_deletion_forbidden'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            result = UserService.delete_user(user_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="User deleted successfully"
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='user_deletion_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"User deletion error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="User deletion failed",
                    details=str(e),
                    code='user_deletion_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user profile."""
        try:
            result = UserService.get_user_profile(request.user.id)
            
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
                    code='profile_retrieval_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """Update user profile."""
        try:
            profile_dto = UserProfileUpdateDTO(**request.data)
            result = UserService.update_user_profile(request.user.id, profile_dto)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="Profile updated successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        details=result.get('details'),
                        code='profile_update_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Profile update error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Profile update failed",
                    details=str(e),
                    code='profile_update_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserActivityView(generics.ListAPIView):
    """Get user activity logs."""
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['action']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_queryset(self):
        """Get user activity queryset."""
        user_id = self.kwargs.get('user_id', self.request.user.id)
        
        # Check permissions
        if user_id != self.request.user.id and not self.request.user.is_admin:
            return UserService.get_user_activities_queryset(self.request.user.id)
        
        return UserService.get_user_activities_queryset(user_id)
    
    def list(self, request, *args, **kwargs):
        """List user activities."""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            
            if page is not None:
                # Serialize activities
                activities = []
                for activity in page:
                    activities.append({
                        'id': activity.id,
                        'action': activity.action,
                        'description': activity.description,
                        'ip_address': activity.ip_address,
                        'timestamp': activity.timestamp,
                    })
                
                return self.get_paginated_response(activities)
            
            # Serialize all activities
            activities = []
            for activity in queryset:
                activities.append({
                    'id': activity.id,
                    'action': activity.action,
                    'description': activity.description,
                    'ip_address': activity.ip_address,
                    'timestamp': activity.timestamp,
                })
            
            return Response(
                SuccessResponseDTO(
                    message="Activities retrieved successfully",
                    data=activities
                ).to_dict(),
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Activity list error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Failed to retrieve activities",
                    details=str(e),
                    code='activity_list_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserToggleStatusView(generics.UpdateAPIView):
    """Toggle user active status (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def put(self, request, user_id):
        """Toggle user active status."""
        try:
            if user_id == request.user.id:
                return Response(
                    ErrorResponseDTO(
                        error="Cannot toggle your own status",
                        code='self_toggle_forbidden'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            result = UserService.toggle_user_status(user_id, request.user)
            
            if result['success']:
                return Response(
                    SuccessResponseDTO(
                        message="User status updated successfully",
                        data=result['data']
                    ).to_dict(),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    ErrorResponseDTO(
                        error=result['error'],
                        code='status_toggle_failed'
                    ).to_dict(),
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Status toggle error: {e}")
            return Response(
                ErrorResponseDTO(
                    error="Status toggle failed",
                    details=str(e),
                    code='status_toggle_error'
                ).to_dict(),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
