from dataclasses import dataclass
from typing import Optional


@dataclass
class LoginRequestDTO:
    """Data Transfer Object for login requests."""
    email: str
    password: str
    
    def __post_init__(self):
        """Validate login request data."""
        if not self.email:
            raise ValueError("Email is required")
        if not self.password:
            raise ValueError("Password is required")


@dataclass
class LoginResponseDTO:
    """Data Transfer Object for login responses."""
    access_token: str
    refresh_token: str
    user: dict
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'access_token': self.access_token,
            'refresh_token': self.refresh_token,
            'user': self.user
        }


@dataclass
class RegisterRequestDTO:
    """Data Transfer Object for registration requests."""
    email: str
    password: str
    first_name: str
    last_name: str
    role: Optional[str] = 'lecteur'
    
    def __post_init__(self):
        """Validate registration request data."""
        if not self.email:
            raise ValueError("Email is required")
        if not self.password:
            raise ValueError("Password is required")
        if not self.first_name:
            raise ValueError("First name is required")
        if not self.last_name:
            raise ValueError("Last name is required")
        
        # Validate role
        valid_roles = ['admin', 'agent', 'lecteur']
        if self.role not in valid_roles:
            raise ValueError(f"Role must be one of: {', '.join(valid_roles)}")


@dataclass
class RegisterResponseDTO:
    """Data Transfer Object for registration responses."""
    access_token: str
    refresh_token: str
    user: dict
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'access_token': self.access_token,
            'refresh_token': self.refresh_token,
            'user': self.user
        }


@dataclass
class RefreshTokenRequestDTO:
    """Data Transfer Object for token refresh requests."""
    refresh_token: str
    
    def __post_init__(self):
        """Validate refresh token request data."""
        if not self.refresh_token:
            raise ValueError("Refresh token is required")


@dataclass
class RefreshTokenResponseDTO:
    """Data Transfer Object for token refresh responses."""
    access_token: str
    refresh_token: str
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'access_token': self.access_token,
            'refresh_token': self.refresh_token
        }


@dataclass
class ChangePasswordRequestDTO:
    """Data Transfer Object for password change requests."""
    current_password: str
    new_password: str
    confirm_password: str
    user_id: Optional[int] = None
    
    def __post_init__(self):
        """Validate password change request data."""
        if not self.current_password:
            raise ValueError("Current password is required")
        if not self.new_password:
            raise ValueError("New password is required")
        if not self.confirm_password:
            raise ValueError("Password confirmation is required")
        
        if self.new_password != self.confirm_password:
            raise ValueError("New password and confirmation do not match")


@dataclass
class PasswordResetRequestDTO:
    """Data Transfer Object for password reset requests."""
    email: str
    
    def __post_init__(self):
        """Validate password reset request data."""
        if not self.email:
            raise ValueError("Email is required")


@dataclass
class PasswordResetConfirmDTO:
    """Data Transfer Object for password reset confirmation."""
    token: str
    new_password: str
    confirm_password: str
    
    def __post_init__(self):
        """Validate password reset confirmation data."""
        if not self.token:
            raise ValueError("Reset token is required")
        if not self.new_password:
            raise ValueError("New password is required")
        if not self.confirm_password:
            raise ValueError("Password confirmation is required")
        
        if self.new_password != self.confirm_password:
            raise ValueError("New password and confirmation do not match")


@dataclass
class EmailVerificationRequestDTO:
    """Data Transfer Object for email verification requests."""
    token: str
    
    def __post_init__(self):
        """Validate email verification request data."""
        if not self.token:
            raise ValueError("Verification token is required")


@dataclass
class UserSessionDTO:
    """Data Transfer Object for user session information."""
    session_key: str
    ip_address: str
    user_agent: str
    created_at: str
    last_activity: str
    is_active: bool
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'session_key': self.session_key,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at,
            'last_activity': self.last_activity,
            'is_active': self.is_active
        }


@dataclass
class LoginAttemptDTO:
    """Data Transfer Object for login attempt information."""
    email: str
    ip_address: str
    user_agent: str
    success: bool
    timestamp: str
    failure_reason: Optional[str] = None
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'email': self.email,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'success': self.success,
            'timestamp': self.timestamp,
            'failure_reason': self.failure_reason
        }


@dataclass
class TokenValidationDTO:
    """Data Transfer Object for token validation."""
    token: str
    token_type: str  # 'access' or 'refresh'
    
    def __post_init__(self):
        """Validate token validation request data."""
        if not self.token:
            raise ValueError("Token is required")
        
        valid_types = ['access', 'refresh']
        if self.token_type not in valid_types:
            raise ValueError(f"Token type must be one of: {', '.join(valid_types)}")


@dataclass
class TokenValidationResponseDTO:
    """Data Transfer Object for token validation responses."""
    is_valid: bool
    user_id: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None
    expires_at: Optional[str] = None
    error: Optional[str] = None
    
    def to_dict(self):
        """Convert to dictionary."""
        result = {
            'is_valid': self.is_valid
        }
        
        if self.is_valid:
            result.update({
                'user_id': self.user_id,
                'email': self.email,
                'role': self.role,
                'expires_at': self.expires_at
            })
        else:
            result['error'] = self.error
        
        return result
