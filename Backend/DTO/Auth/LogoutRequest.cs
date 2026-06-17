using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Auth
{
    public class LogoutRequest
    {
        public string Email { get; set; }
        public string RefreshToken { get; set; }
    }
}
