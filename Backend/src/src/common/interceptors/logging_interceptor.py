import logging
import time
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class LoggingInterceptor(MiddlewareMixin):
    """Middleware for logging requests and responses."""
    
    def process_request(self, request):
        """Log incoming request."""
        request.start_time = time.time()
        
        logger.info(f"Request: {request.method} {request.path} "
                   f"from {request.META.get('REMOTE_ADDR', 'unknown')}")
        
        # Log request body for POST/PUT requests (be careful with sensitive data)
        if request.method in ['POST', 'PUT', 'PATCH'] and hasattr(request, 'body'):
            try:
                body = request.body.decode('utf-8')
                if len(body) < 1000:  # Only log small bodies
                    logger.debug(f"Request body: {body}")
            except UnicodeDecodeError:
                logger.debug("Request body contains binary data")
        
        return None
    
    def process_response(self, request, response):
        """Log outgoing response."""
        duration = time.time() - getattr(request, 'start_time', time.time())
        
        logger.info(f"Response: {response.status_code} "
                   f"for {request.method} {request.path} "
                   f"in {duration:.3f}s")
        
        return response


class DataTransformationInterceptor(MiddlewareMixin):
    """Middleware for data transformation."""
    
    def process_response(self, request, response):
        """Transform response data if needed."""
        # Add custom headers
        response['X-API-Version'] = '1.0'
        response['X-Response-Time'] = str(time.time())
        
        return response


class ResponseWrapperInterceptor(MiddlewareMixin):
    """Middleware for wrapping responses in consistent format."""
    
    def process_response(self, request, response):
        """Wrap response in consistent format."""
        # Skip wrapping for certain content types
        content_type = response.get('Content-Type', '')
        if any(skip_type in content_type for skip_type in ['image/', 'video/', 'application/pdf']):
            return response
        
        # Only wrap JSON responses
        if 'application/json' in content_type and hasattr(response, 'content'):
            try:
                import json
                content = json.loads(response.content.decode('utf-8'))
                
                # Only wrap if not already wrapped
                if not isinstance(content, dict) or 'success' not in content:
                    wrapped_content = {
                        'success': response.status_code < 400,
                        'data': content,
                        'status_code': response.status_code
                    }
                    
                    response.content = json.dumps(wrapped_content).encode('utf-8')
                    response['Content-Length'] = len(response.content)
            except (json.JSONDecodeError, UnicodeDecodeError):
                pass
        
        return response
