using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UsersDTO;
using BL = BusinessLayer;

namespace backend.Controllers
{

    // This controller is responsible for authentication-related actions,
    // such as logging in and issuing JWT tokens.
    [ApiController]
    [Route("api/Auth")]
    public class AuthController : ControllerBase
    {
        // This endpoint handles user login.
        // It verifies credentials and returns a JWT token if login succeeds.
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Step 1: Find the user by email
            // Email acts as the unique login identifier.
            var foundUser = BL.User.FindByEmail(request.Email);

            if (foundUser == null || foundUser.UDTO == null)
                return Unauthorized("Invalid credentials");

            var user = foundUser.UDTO;

            // Step 2: Verify the provided password against the stored hash.
            // BCrypt handles hashing and salt internally.
            bool isValidPassword = foundUser.VerifyPassword(request.Password);

            // If the password does not match the stored hash,
            // return 401 Unauthorized.
            if (!isValidPassword)
                return Unauthorized("Invalid credentials");

            // Step 3: Create claims that represent the authenticated user's identity.
            // These claims will be embedded inside the JWT.
            var claims = new[]
            {
                // Unique identifier for the user
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

                // User's full name (for display purposes)
                new Claim(ClaimTypes.Name, $"{user.Firstname} {user.Lastname}"),

                

                // user email address
                new Claim(ClaimTypes.Email, user.Email),

                // Role (Agent Or lecture or Admin) used later for authorization
                new Claim(ClaimTypes.Role, user.RoleName)
            };

            // Step 4: Create the symmetric security key used to sign the JWT.
            // This key must match the key used in JWT validation middleware.
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("THIS_IS_A_VERY_SECRET_KEY_123456"));

            // Step 5: Define the signing credentials.
            // This specifies the algorithm used to sign the token.
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Step 6: Create the JWT token.
            // The token includes issuer, audience, claims, expiration, and signature.
            var token = new JwtSecurityToken(
                issuer: "BureauOrderArchiveAPI",
                audience: "BureauOrderArchiveAPIUsers",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            // Step 7: Return the serialized JWT token to the client.
            // The client will send this token with future requests.
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                refreshToken = "", // مؤقتًا إذا لم تطبق refresh token بعد
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    fullName = $"{user.Firstname} {user.Lastname}",
                    role = user.RoleName
                }
            });
        }



    }
}

