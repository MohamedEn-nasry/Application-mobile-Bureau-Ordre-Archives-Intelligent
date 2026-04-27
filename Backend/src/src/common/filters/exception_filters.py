import logging
from django.http import JsonResponse
from django.core.exceptions import ValidationError, PermissionDenied
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated
from rest_framework.views import exception_handler
from common.dto.response_dto import ErrorResponseDTO

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Custom exception handler for consistent error responses."""
    
    # Log the exception
    logger.error(f"Exception occurred: {exc} in context: {context}")
    
    # Handle DRF exceptions first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize DRF exception responses
        custom_response_data = ErrorResponseDTO(
            error=response.data.get('detail', str(exc)),
            details=str(exc),
            code=response.status_code,
            status_code=response.status_code
        ).to_dict()
        
        response.data = custom_response_data
        return response
    
    # Handle Django exceptions
    if isinstance(exc, ValidationError):
        return JsonResponse(
            ErrorResponseDTO(
                error="Validation Error",
                details=str(exc),
                code="validation_error",
                status_code=400
            ).to_dict(),
            status=400
        )
    
    elif isinstance(exc, PermissionDenied):
        return JsonResponse(
            ErrorResponseDTO(
                error="Permission Denied",
                details="You don't have permission to perform this action.",
                code="permission_denied",
                status_code=403
            ).to_dict(),
            status=403
        )
    
    elif isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
        return JsonResponse(
            ErrorResponseDTO(
                error="Authentication Failed",
                details="Authentication credentials were not provided or are invalid.",
                code="authentication_failed",
                status_code=401
            ).to_dict(),
            status=401
        )
    
    # Handle unknown exceptions
    return JsonResponse(
        ErrorResponseDTO(
            error="Internal Server Error",
            details="An unexpected error occurred. Please try again later.",
            code="internal_error",
            status_code=500
        ).to_dict(),
        status=500
    )


class GlobalExceptionFilter:
    """Middleware for global exception handling."""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_exception(self, request, exception):
        """Process unhandled exceptions."""
        logger.error(f"Unhandled exception: {exception}", exc_info=True)
        return None
