from functools import wraps
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from modules.users.entities import User


def get_user_from_token(request):
    """Extract user from JWT token."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist):
        return None


def require_authentication(view_func):
    """Decorator to require authentication."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        user = get_user_from_token(request)
        if not user or isinstance(user, AnonymousUser):
            return JsonResponse({'error': 'Authentication required'}, status=401)
        request.user = user
        return view_func(request, *args, **kwargs)
    return wrapper


def require_roles(allowed_roles):
    """Decorator to require specific roles."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            user = getattr(request, 'user', None)
            if not user or not user.is_authenticated:
                return JsonResponse({'error': 'Authentication required'}, status=401)
            
            if not hasattr(user, 'role') or user.role not in allowed_roles:
                return JsonResponse({'error': 'Insufficient permissions'}, status=403)
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def rate_limit(max_requests=100, window=3600):
    """Simple rate limiting decorator."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Implement rate limiting logic here
            # This is a placeholder - you'd want to use Redis or similar for production
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
