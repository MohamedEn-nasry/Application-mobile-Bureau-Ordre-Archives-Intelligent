from typing import Any, Dict, List, Optional
from dataclasses import dataclass


@dataclass
class ResponseDTO:
    """Standard response format for API responses."""
    success: bool
    message: str
    data: Optional[Any] = None
    errors: Optional[List[str]] = None
    status_code: int = 200

    def to_dict(self) -> Dict[str, Any]:
        result = {
            'success': self.success,
            'message': self.message,
            'status_code': self.status_code
        }
        
        if self.data is not None:
            result['data'] = self.data
        
        if self.errors:
            result['errors'] = self.errors
            
        return result


@dataclass
class ErrorResponseDTO:
    """Standard error response format."""
    error: str
    details: Optional[str] = None
    code: Optional[str] = None
    status_code: int = 400

    def to_dict(self) -> Dict[str, Any]:
        result = {
            'error': self.error,
            'status_code': self.status_code
        }
        
        if self.details:
            result['details'] = self.details
            
        if self.code:
            result['code'] = self.code
            
        return result


@dataclass
class SuccessResponseDTO:
    """Standard success response format."""
    message: str
    data: Optional[Any] = None
    status_code: int = 200

    def to_dict(self) -> Dict[str, Any]:
        result = {
            'success': True,
            'message': self.message,
            'status_code': self.status_code
        }
        
        if self.data is not None:
            result['data'] = self.data
            
        return result
