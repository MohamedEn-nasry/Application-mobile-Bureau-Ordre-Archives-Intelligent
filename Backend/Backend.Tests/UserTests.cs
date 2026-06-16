using System;
using Xunit;
using BusinessLayer;
using UsersDTO;
using BCrypt.Net;

namespace Backend.Tests
{
    public class UserTests
    {
        private UserDTO CreateMockUserDTO(string password = null)
        {
            return new UserDTO(
                1,
                "Test",
                "User",
                "test@example.com",
                password,
                "Admin",
                true,
                DateTime.UtcNow,
                DateTime.UtcNow,
                null
            );
        }

        [Fact]
        public void SetPassword_EmptyPassword_ThrowsArgumentException()
        {
            // Arrange
            var userDto = CreateMockUserDTO();
            var user = new User(userDto);

            // Act & Assert
            Assert.Throws<ArgumentException>(() => user.SetPassword(""));
            Assert.Throws<ArgumentException>(() => user.SetPassword(null));
            Assert.Throws<ArgumentException>(() => user.SetPassword("   "));
        }

        [Fact]
        public void VerifyPassword_CorrectPassword_ReturnsTrue()
        {
            // Arrange
            string plainPassword = "MySecurePassword123!";
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            var userDto = CreateMockUserDTO(hashedPassword);
            var user = new User(userDto);

            // Act
            bool result = user.VerifyPassword(plainPassword);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void VerifyPassword_WrongPassword_ReturnsFalse()
        {
            // Arrange
            string plainPassword = "MySecurePassword123!";
            string wrongPassword = "WrongPassword123!";
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            var userDto = CreateMockUserDTO(hashedPassword);
            var user = new User(userDto);

            // Act
            bool result = user.VerifyPassword(wrongPassword);

            // Assert
            Assert.False(result);
        }
        
        [Fact]
        public void VerifyPassword_EmptyPassword_ReturnsFalse()
        {
            // Arrange
            string plainPassword = "MySecurePassword123!";
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            var userDto = CreateMockUserDTO(hashedPassword);
            var user = new User(userDto);

            // Act
            bool result1 = user.VerifyPassword("");
            bool result2 = user.VerifyPassword(null);

            // Assert
            Assert.False(result1);
            Assert.False(result2);
        }
    }
}
