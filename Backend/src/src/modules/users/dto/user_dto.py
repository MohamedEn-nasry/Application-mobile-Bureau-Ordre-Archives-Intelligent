from dataclasses import dataclass
from typing import Optional, List
from rest_framework import serializers


@dataclass
class UserCreateDTO:
    """Data Transfer Object for user creation."""
    email: str
    password: str
    first_name: str
    last_name: str
    role: str = 'lecteur'
    phone_number: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    employee_id: Optional[str] = None
    
    def __post_init__(self):
        """Validate user creation data."""
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
class UserUpdateDTO:
    """Data Transfer Object for user updates."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    employee_id: Optional[str] = None
    is_active: Optional[bool] = None
    
    def __post_init__(self):
        """Validate user update data."""
        if self.role is not None:
            valid_roles = ['admin', 'agent', 'lecteur']
            if self.role not in valid_roles:
                raise ValueError(f"Role must be one of: {', '.join(valid_roles)}")


@dataclass
class UserProfileUpdateDTO:
    """Data Transfer Object for user profile updates."""
    bio: Optional[str] = None
    website: Optional[str] = None
    linkedin_profile: Optional[str] = None
    github_profile: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None
    theme_preference: Optional[str] = None
    notification_preferences: Optional[dict] = None
    
    def __post_init__(self):
        """Validate profile update data."""
        if self.theme_preference is not None:
            valid_themes = ['light', 'dark', 'auto']
            if self.theme_preference not in valid_themes:
                raise ValueError(f"Theme preference must be one of: {', '.join(valid_themes)}")


@dataclass
class UserPasswordChangeDTO:
    """Data Transfer Object for password changes."""
    current_password: str
    new_password: str
    confirm_password: str
    
    def __post_init__(self):
        """Validate password change data."""
        if not self.current_password:
            raise ValueError("Current password is required")
        if not self.new_password:
            raise ValueError("New password is required")
        if not self.confirm_password:
            raise ValueError("Password confirmation is required")
        
        if self.new_password != self.confirm_password:
            raise ValueError("New password and confirmation do not match")


@dataclass
class UserResponseDTO:
    """Data Transfer Object for user responses."""
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    phone_number: Optional[str]
    department: Optional[str]
    position: Optional[str]
    employee_id: Optional[str]
    is_active: bool
    is_email_verified: bool
    date_joined: str
    last_login: Optional[str]
    created_at: str
    updated_at: str
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'phone_number': self.phone_number,
            'department': self.department,
            'position': self.position,
            'employee_id': self.employee_id,
            'is_active': self.is_active,
            'is_email_verified': self.is_email_verified,
            'date_joined': str(self.date_joined),
            'last_login': str(self.last_login) if self.last_login else None,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at),
        }


@dataclass
class UserListDTO:
    """Data Transfer Object for user list items."""
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    department: Optional[str]
    position: Optional[str]
    employee_id: Optional[str]
    is_active: bool
    date_joined: str
    last_login: Optional[str]
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'department': self.department,
            'position': self.position,
            'employee_id': self.employee_id,
            'is_active': self.is_active,
            'date_joined': str(self.date_joined),
            'last_login': str(self.last_login) if self.last_login else None,
        }


@dataclass
class UserProfileDTO:
    """Data Transfer Object for user profile."""
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    phone_number: Optional[str]
    profile_picture: Optional[str]
    date_of_birth: Optional[str]
    address: Optional[str]
    department: Optional[str]
    position: Optional[str]
    employee_id: Optional[str]
    is_active: bool
    is_email_verified: bool
    date_joined: str
    last_login: Optional[str]
    last_login_ip: Optional[str]
    bio: Optional[str]
    website: Optional[str]
    linkedin_profile: Optional[str]
    github_profile: Optional[str]
    timezone: str
    language: str
    theme_preference: str
    notification_preferences: dict
    two_factor_enabled: bool
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'phone_number': self.phone_number,
            'profile_picture': self.profile_picture,
            'date_of_birth': str(self.date_of_birth) if self.date_of_birth else None,
            'address': self.address,
            'department': self.department,
            'position': self.position,
            'employee_id': self.employee_id,
            'is_active': self.is_active,
            'is_email_verified': self.is_email_verified,
            'date_joined': str(self.date_joined),
            'last_login': str(self.last_login) if self.last_login else None,
            'last_login_ip': str(self.last_login_ip) if self.last_login_ip else None,
            'bio': self.bio,
            'website': self.website,
            'linkedin_profile': self.linkedin_profile,
            'github_profile': self.github_profile,
            'timezone': self.timezone,
            'language': self.language,
            'theme_preference': self.theme_preference,
            'notification_preferences': self.notification_preferences,
            'two_factor_enabled': self.two_factor_enabled,
        }


@dataclass
class UserActivityDTO:
    """Data Transfer Object for user activity."""
    id: int
    action: str
    description: str
    ip_address: str
    user_agent: str
    timestamp: str
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': self.id,
            'action': self.action,
            'description': self.description,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'timestamp': str(self.timestamp),
        }


@dataclass
class UserSearchDTO:
    """Data Transfer Object for user search."""
    query: str
    limit: int = 20
    
    def __post_init__(self):
        """Validate search data."""
        if not self.query:
            raise ValueError("Search query is required")
        if self.limit <= 0 or self.limit > 100:
            raise ValueError("Limit must be between 1 and 100")


@dataclass
class UserStatisticsDTO:
    """Data Transfer Object for user statistics."""
    total_users: int
    active_users: int
    inactive_users: int
    users_by_role: List[dict]
    users_by_department: List[dict]
    new_users_last_30_days: int
    active_users_last_30_days: int
    email_verified_users: int
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'total_users': self.total_users,
            'active_users': self.active_users,
            'inactive_users': self.inactive_users,
            'users_by_role': self.users_by_role,
            'users_by_department': self.users_by_department,
            'new_users_last_30_days': self.new_users_last_30_days,
            'active_users_last_30_days': self.active_users_last_30_days,
            'email_verified_users': self.email_verified_users,
        }


@dataclass
class UserPermissionDTO:
    """Data Transfer Object for user permissions."""
    user_id: int
    permission: str
    granted_by_id: Optional[int]
    granted_at: str
    expires_at: Optional[str]
    is_active: bool
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'user_id': self.user_id,
            'permission': self.permission,
            'granted_by_id': self.granted_by_id,
            'granted_at': str(self.granted_at),
            'expires_at': str(self.expires_at) if self.expires_at else None,
            'is_active': self.is_active,
        }


# DRF Serializers for API validation
class UserCreateSerializer(serializers.Serializer):
    """DRF serializer for user creation."""
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    role = serializers.ChoiceField(choices=['admin', 'agent', 'lecteur'], default='lecteur')
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)
    position = serializers.CharField(max_length=100, required=False, allow_blank=True)
    employee_id = serializers.CharField(max_length=50, required=False, allow_blank=True)


class UserUpdateSerializer(serializers.Serializer):
    """DRF serializer for user updates."""
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=['admin', 'agent', 'lecteur'], required=False)
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)
    position = serializers.CharField(max_length=100, required=False, allow_blank=True)
    employee_id = serializers.CharField(max_length=50, required=False, allow_blank=True)
    is_active = serializers.BooleanField(required=False)


class UserProfileUpdateSerializer(serializers.Serializer):
    """DRF serializer for profile updates."""
    bio = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    linkedin_profile = serializers.URLField(required=False, allow_blank=True)
    github_profile = serializers.URLField(required=False, allow_blank=True)
    timezone = serializers.CharField(max_length=50, required=False)
    language = serializers.CharField(max_length=10, required=False)
    theme_preference = serializers.ChoiceField(
        choices=['light', 'dark', 'auto'], 
        required=False
    )
    notification_preferences = serializers.JSONField(required=False)


class PasswordChangeSerializer(serializers.Serializer):
    """DRF serializer for password changes."""
    current_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField()
    
    def validate(self, data):
        """Validate password change data."""
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords do not match")
        return data
