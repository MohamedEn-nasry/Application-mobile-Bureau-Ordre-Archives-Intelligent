using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Auth
{
    public class RefreshRequest
    {
        public string RefreshToken { get; set; }
        public string Email { get; set; }
    }
}
