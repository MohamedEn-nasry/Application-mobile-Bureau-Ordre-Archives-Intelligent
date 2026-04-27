from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from rest_framework.permissions import BasePermission
from common.decorators.auth_decorators import get_user_from_token


class IsAuthenticated(BasePermission):
    """Custom permission class to check if user is authenticated."""
    
    def has_permission(self, request, view):
        user = get_user_from_token(request)
        if not user or isinstance(user, AnonymousUser):
            return False
        request.user = user
        return True


class IsAdminUser(BasePermission):
    """Custom permission class to check if user is admin."""
    
    def has_permission(self, request, view):
        user = get_user_from_token(request)
        if not user or isinstance(user, AnonymousUser):
            return False
        
        request.user = user
        return hasattr(user, 'role') and user.role == 'admin'


class IsAgent(BasePermission):
    """Custom permission class to check if user is agent."""
    
    def has_permission(self, request, view):
        user = get_user_from_token(request)
        if not user or isinstance(user, AnonymousUser):
            return False
        
        request.user = user
        return hasattr(user, 'role') and user.role == 'agent'


class IsLecteur(BasePermission):
    """Custom permission class to check if user is lecteur."""
    
    def has_permission(self, request, view):
        user = get_user_from_token(request)
        if not user or isinstance(user, AnonymousUser):
            return False
        
        request.user = user
        return hasattr(user, 'role') and user.role == 'lecteur'


class IsOwnerOrAdmin(BasePermission):
    """Custom permission class to check if user is owner or admin."""
    
    def has_object_permission(self, request, view, obj):
        user = get_user_from_token(request)
        if not user or isinstance(user, AnonymousUser):
            return False
        
        # Check if user is admin
        if hasattr(user, 'role') and user.role == 'admin':
            return True
        
        # Check if user is owner (assuming obj has a user field)
        return hasattr(obj, 'user') and obj.user == user


class AuthGuard:
    """Guard class for authentication and authorization."""
    
    @staticmethod
    def authenticate(request):
        """Authenticate user from request."""
        user = get_user_from_token(request)
        if not user or isinstance(user, AnonymousUser):
            return None, JsonResponse(
                {'error': 'Authentication required'}, 
                status=401
            )
        return user, None
    
    @staticmethod
    def authorize(user, required_roles):
        """Authorize user based on roles."""
        if not hasattr(user, 'role') or user.role not in required_roles:
            return False, JsonResponse(
                {'error': 'Insufficient permissions'}, 
                status=403
            )
        return True, None
