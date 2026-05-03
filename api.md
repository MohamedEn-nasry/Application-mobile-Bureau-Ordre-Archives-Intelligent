# System Information API Documentation

## Overview
This document describes the API endpoints required for the System Information Page functionality. The frontend needs to retrieve system status and configuration information from the backend.

## Required API Endpoints

### 1. Get System Status
**Endpoint:** `GET /api/system/status`
**Description:** Returns current system status including server health, database connectivity, and performance metrics.

**Request:** No parameters required
**Headers:** 
- `Authorization: Bearer {JWT_TOKEN}` (required)

**Response JSON:**
```json
{
  "serverStatus": "online|offline|maintenance",
  "databaseStatus": "connected|disconnected|error",
  "apiHealth": "healthy|warning|critical",
  "uptime": "5 days, 14 hours",
  "activeUsers": 23,
  "memoryUsage": 45.2,
  "cpuUsage": 12.8,
  "lastUpdated": "2026-05-03T17:00:00Z"
}
```

### 2. Get System Configuration
**Endpoint:** `GET /api/system/config`
**Description:** Returns system configuration information including API version, environment settings, and feature flags.

**Request:** No parameters required
**Headers:** 
- `Authorization: Bearer {JWT_TOKEN}` (required)

**Response JSON:**
```json
{
  "apiVersion": "2.1.0",
  "environment": "development|staging|production",
  "buildNumber": "2024.05.03.001",
  "features": [
    {
      "name": "Email Notifications",
      "enabled": true
    },
    {
      "name": "Two-Factor Auth",
      "enabled": false
    },
    {
      "name": "File Upload",
      "enabled": true
    },
    {
      "name": "Real-time Updates",
      "enabled": true
    }
  ],
  "database": {
    "type": "PostgreSQL",
    "maxConnections": 100,
    "currentConnections": 23
  },
  "auth": {
    "jwtExpirationHours": 24,
    "requireEmailVerification": true,
    "maxLoginAttempts": 5
  },
  "corsOrigins": [
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:8083"
  ],
  "lastUpdated": "2026-05-03T17:00:00Z"
}
```

## Backend Implementation Requirements

### Files to Create

#### 1. Backend/Presentation/Controllers/SystemInfoController.cs
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/system")]
[Authorize] // Requires authentication
public class SystemInfoController : ControllerBase
{
    [HttpGet("status")]
    public IActionResult GetSystemStatus()
    {
        // Implement system status retrieval logic
        // Return SystemStatusDto
    }

    [HttpGet("config")]
    public IActionResult GetSystemConfig()
    {
        // Implement system configuration retrieval logic
        // Return SystemConfigDto
    }
}
```

#### 2. Backend/DTO/SystemInfoDTO.cs
```csharp
// SystemStatusDto
public class SystemStatusDto
{
    public string ServerStatus { get; set; }
    public string DatabaseStatus { get; set; }
    public string ApiHealth { get; set; }
    public string Uptime { get; set; }
    public int ActiveUsers { get; set; }
    public double MemoryUsage { get; set; }
    public double CpuUsage { get; set; }
    public string LastUpdated { get; set; }
}

// SystemConfigDto
public class SystemConfigDto
{
    public string ApiVersion { get; set; }
    public string Environment { get; set; }
    public string BuildNumber { get; set; }
    public List<FeatureFlagDto> Features { get; set; }
    public DatabaseConfigDto Database { get; set; }
    public AuthConfigDto Auth { get; set; }
    public List<string> CorsOrigins { get; set; }
    public string LastUpdated { get; set; }
}

// Supporting DTOs
public class FeatureFlagDto
{
    public string Name { get; set; }
    public bool Enabled { get; set; }
}

public class DatabaseConfigDto
{
    public string Type { get; set; }
    public int MaxConnections { get; set; }
    public int CurrentConnections { get; set; }
}

public class AuthConfigDto
{
    public int JwtExpirationHours { get; set; }
    public bool RequireEmailVerification { get; set; }
    public int MaxLoginAttempts { get; set; }
}
```

#### 3. Backend/Business Layer/SystemInfoService.cs
```csharp
public class SystemInfoService
{
    public SystemStatusDto GetSystemStatus()
    {
        // Implement logic to gather system status:
        // - Check server status
        // - Test database connectivity
        // - Get performance metrics
        // - Calculate uptime
        // - Count active users/sessions
    }

    public SystemConfigDto GetSystemConfig()
    {
        // Implement logic to gather system configuration:
        // - Get API version from assembly
        // - Determine environment
        // - Load feature flags
        // - Get database configuration
        // - Get authentication settings
        // - Get CORS origins
    }
}
```

### Files to Modify

#### Backend/Presentation/Program.cs
Add the following to register the service (if using dependency injection):
```csharp
// Add before var app = builder.Build();
builder.Services.AddScoped<SystemInfoService>();
```

## Implementation Notes

### Security Considerations
- Both endpoints require authentication (JWT token)
- Consider adding role-based authorization (admin-only access)
- Sanitize sensitive configuration data before returning
- Add rate limiting for system info endpoints

### Performance Considerations
- Cache system status data for short periods (e.g., 30 seconds)
- Avoid expensive operations for frequent requests
- Consider background tasks for heavy metrics collection

### Error Handling
- Return appropriate HTTP status codes
- Provide meaningful error messages
- Handle database connection failures gracefully

### Frontend Integration
The frontend expects the exact JSON structure shown above. Any deviations will cause parsing errors in the React Native application.

## Testing
Test the endpoints with tools like Postman or curl:
```bash
# Test system status
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/system/status

# Test system config
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/system/config
```

## Deployment Notes
- Ensure the API endpoints are accessible from the mobile app
- Verify CORS settings allow requests from mobile app origins
- Monitor endpoint performance in production
