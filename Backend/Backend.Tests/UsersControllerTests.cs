using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using DTO.Users;
using System.Collections.Generic;

namespace Backend.Tests
{
    public class UsersControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;

        public UsersControllerTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetAllUsers_WithoutToken_ReturnsUnauthorized()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/Users/All");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetAllUsers_WithLecteurRoleToken_ReturnsForbidden()
        {
            // Arrange
            var client = _factory.CreateClient();
            string token = AuthTokenHelper.GenerateTestToken(1, "lecteur@example.com", "John", "Doe", "Lecteur");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await client.GetAsync("/api/Users/All");

            // Assert
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task SearchByEmail_WithShortQuery_ReturnsEmptyListWithoutDbCall()
        {
            // Arrange
            var client = _factory.CreateClient();
            string token = AuthTokenHelper.GenerateTestToken(1, "agent@example.com", "Jane", "Smith", "Agent");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await client.GetAsync("/api/Users/search-by-email?email=a");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<List<object>>();
            Assert.NotNull(content);
            Assert.Empty(content);
        }

        [Fact]
        public async Task GetUserById_WithInvalidId_ReturnsBadRequest()
        {
            // Arrange
            var client = _factory.CreateClient();
            string token = AuthTokenHelper.GenerateTestToken(1, "admin@example.com", "Admin", "User", "Admin");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await client.GetAsync("/api/Users/0");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
