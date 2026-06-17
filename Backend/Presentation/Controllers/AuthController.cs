using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DTO.Auth;
using BL = BusinessLayer;
using DTO.Users;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers
{

    // This controller is responsible for authentication-related actions,
    // such as logging in and issuing JWT tokens.
    [ApiController]

    [Route("api/Auth")]
    public class AuthController : ControllerBase
    {
        // Generate a secure random refresh token
        private static string GenerateRefreshToken()
        {
            var bytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        // Create JWT token with claims
        private JwtSecurityToken CreateAccessToken(UserDTO user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.Firstname} {user.Lastname}"),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.RoleName)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("THIS_IS_A_VERY_SECRET_KEY_123456"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            return new JwtSecurityToken(
                issuer: "BureauOrderArchiveAPI",
                audience: "BureauOrderArchiveAPIUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );
        }


/// //////////////////////////////////////////////////////////////////////////////////////////////////

        // This endpoint handles user login.
        // It verifies credentials and returns JWT + Refresh tokens.
        [HttpPost("login")]
        [EnableRateLimiting("AuthLimiter")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Step 1: Find the user by email
            var foundUser = BL.User.FindByEmail(request.Email);

            if (foundUser == null || foundUser.UDTO == null)
                return Unauthorized("Invalid credentials");

            var user = foundUser.UDTO;

            // Step 2: Verify the provided password against the stored hash.
            bool isValidPassword = foundUser.VerifyPassword(request.Password);

            if (!isValidPassword)
                return Unauthorized("Invalid credentials");

            // Step 3: Create access token
            var token = CreateAccessToken(user);
            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            // Step 4: Generate refresh token
            var refreshToken = GenerateRefreshToken();

            // Step 5: Store refresh token securely (hashed) - using optimized method
            var tokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);
            var expiresAt = DateTime.UtcNow.AddDays(7);
            BL.User.UpdateRefreshToken(user.Id, tokenHash, expiresAt, null);

            // Step 6: Return both tokens with user info
            return Ok(new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserInfoResponse
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = $"{user.Firstname} {user.Lastname}",
                    Role = user.RoleName
                }
            });
        }


/// ///////////////////////////////////////////////////////////////////////////////////////////////


        // Refresh endpoint - issues new access token using refresh token
        [HttpPost("refresh")]
        [EnableRateLimiting("AuthLimiter")]
        public IActionResult Refresh([FromBody] RefreshRequest request)
        {
            // Step 1: Find user by email
            var foundUser = BL.User.FindByEmail(request.Email);

            if (foundUser == null)
                return Unauthorized("Invalid refresh request");

            var user = foundUser.UDTO;

            // Step 2: Check if refresh token is revoked
            if (foundUser.RefreshTokenRevokedAt != null)
                return Unauthorized("Refresh token is revoked");

            // Step 3: Check if refresh token is expired
            if (foundUser.RefreshTokenExpiresAt == null || 
                foundUser.RefreshTokenExpiresAt <= DateTime.UtcNow)
                return Unauthorized("Refresh token expired");

            // Step 4: Verify the refresh token hash
            bool refreshValid = BCrypt.Net.BCrypt.Verify(
                request.RefreshToken, 
                foundUser.RefreshTokenHash ?? "");

            if (!refreshValid)
                return Unauthorized("Invalid refresh token");

            // Step 5: Issue new access token
            var token = CreateAccessToken(user);
            var newAccessToken = new JwtSecurityTokenHandler().WriteToken(token);

            // Step 6: Rotate refresh token (token rotation strategy) - using optimized method
            var newRefreshToken = GenerateRefreshToken();
            var newTokenHash = BCrypt.Net.BCrypt.HashPassword(newRefreshToken);
            var newExpiresAt = DateTime.UtcNow.AddDays(7);
            BL.User.UpdateRefreshToken(user.Id, newTokenHash, newExpiresAt, null);

            // Step 7: Return new tokens with user info
            return Ok(new TokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                User = new UserInfoResponse
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = $"{user.Firstname} {user.Lastname}",
                    Role = user.RoleName
                }
            });
        }




/// //////////////////////////////////////////////////////////////////////////////////////////

        // Logout endpoint - revokes refresh token
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout([FromBody] LogoutRequest request)
        {
            // Step 1: Find user by email
            var foundUser = BL.User.FindByEmail(request.Email);

            if (foundUser == null)
                return Ok(); // Don't reveal if user exists

            // Step 2: Verify refresh token
            bool refreshValid = BCrypt.Net.BCrypt.Verify(
                request.RefreshToken, 
                foundUser.RefreshTokenHash ?? "");

            if (!refreshValid)
                return Ok();

            // Step 3: Revoke refresh token - using optimized method
            BL.User.UpdateRefreshToken(foundUser.ID, foundUser.RefreshTokenHash, foundUser.RefreshTokenExpiresAt ?? DateTime.UtcNow, DateTime.UtcNow);

            return Ok(new { message = "Logged out successfully" });
        }



    }
}

