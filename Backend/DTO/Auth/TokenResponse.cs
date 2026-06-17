using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Auth
{
    public class TokenResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public UserInfoResponse User { get; set; }
    }

    public class UserInfoResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }
}

