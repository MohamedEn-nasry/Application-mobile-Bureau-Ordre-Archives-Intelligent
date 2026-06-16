using System;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using DTO.Courriers;

namespace Backend.Tests
{
    public class CourrierAPIControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;

        public CourrierAPIControllerTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetAll_WithoutToken_ReturnsUnauthorized()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/Courriers");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetAll_WithLecteurRoleToken_ReturnsForbidden()
        {
            // Arrange
            var client = _factory.CreateClient();
            string token = AuthTokenHelper.GenerateTestToken(1, "lecteur@example.com", "John", "Doe", "Lecteur");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await client.GetAsync("/api/Courriers");

            // Assert
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task Create_WithMissingRequiredFields_ReturnsBadRequest()
        {
            // Arrange
            var client = _factory.CreateClient();
            string token = AuthTokenHelper.GenerateTestToken(2, "agent@example.com", "Jane", "Smith", "Agent");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Missing Reference, Type, DateCourrier, and Objet
            var invalidDto = new CreateCourrierDto
            {
                Reference = "",
                Type = "",
                Objet = ""
            };

            // Act
            var response = await client.PostAsJsonAsync("/api/Courriers", invalidDto);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task GetMyAssignedCourriers_WithoutToken_ReturnsUnauthorized()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/Courriers/assigned/me");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}
