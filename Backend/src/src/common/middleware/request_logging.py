import logging
import json
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpRequest

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    """Middleware for detailed request logging."""
    
    def process_request(self, request: HttpRequest):
        """Log incoming requests with detailed information."""
        # Extract relevant request data
        request_data = {
            'method': request.method,
            'path': request.path,
            'query_params': dict(request.GET),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'ip_address': self.get_client_ip(request),
            'content_type': request.content_type,
            'content_length': request.META.get('CONTENT_LENGTH', 0),
        }
        
        # Log headers (excluding sensitive ones)
        headers = {}
        for key, value in request.META.items():
            if key.startswith('HTTP_') and not any(sensitive in key.upper() 
                for sensitive in ['AUTHORIZATION', 'COOKIE', 'TOKEN', 'SECRET']):
                headers[key[5:]] = value
        request_data['headers'] = headers
        
        # Log body for non-GET requests (be careful with sensitive data)
        if request.method in ['POST', 'PUT', 'PATCH'] and hasattr(request, 'body'):
            try:
                body = request.body.decode('utf-8')
                if body and len(body) < 2000:  # Limit size
                    if 'application/json' in request.content_type:
                        try:
                            json_body = json.loads(body)
                            # Remove sensitive fields
                            sensitive_fields = ['password', 'token', 'secret', 'key']
                            for field in sensitive_fields:
                                if field in json_body:
                                    json_body[field] = '***'
                            request_data['body'] = json_body
                        except json.JSONDecodeError:
                            request_data['body'] = body[:200] + '...' if len(body) > 200 else body
                    else:
                        request_data['body'] = body[:200] + '...' if len(body) > 200 else body
            except UnicodeDecodeError:
                request_data['body'] = 'Binary data'
        
        logger.info(f"Request: {json.dumps(request_data, indent=2)}")
        return None
    
    def get_client_ip(self, request):
        """Extract client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class BodyParsingMiddleware(MiddlewareMixin):
    """Middleware for enhanced body parsing."""
    
    def process_request(self, request: HttpRequest):
        """Parse and validate request body."""
        if request.method in ['POST', 'PUT', 'PATCH'] and request.content_type:
            try:
                if 'application/json' in request.content_type:
                    if hasattr(request, 'body') and request.body:
                        try:
                            request.json_data = json.loads(request.body.decode('utf-8'))
                        except json.JSONDecodeError:
                            logger.warning(f"Invalid JSON in request body for {request.path}")
                            request.json_data = {}
                elif 'multipart/form-data' in request.content_type:
                    # Django already parses multipart data
                    pass
                elif 'application/x-www-form-urlencoded' in request.content_type:
                    # Django already parses form data
                    pass
            except Exception as e:
                logger.error(f"Error parsing request body: {e}")
        
        return None


class SecurityMiddleware(MiddlewareMixin):
    """Middleware for security headers and validation."""
    
    def process_response(self, request, response):
        """Add security headers to response."""
        # Add security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Remove server header for security
        response.pop('Server', None)
        
        return response
