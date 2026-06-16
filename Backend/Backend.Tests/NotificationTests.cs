using System;
using Xunit;
using Business_Layer;
using DTO.Notifications;

namespace Backend.Tests
{
    public class NotificationTests
    {
        private NotificationDTO CreateMockNotificationDTO()
        {
            return new NotificationDTO(
                1,
                5,
                "Nouveau Courrier",
                "Un nouveau courrier vous a été assigné.",
                "Info",
                "Courrier",
                12,
                false,
                1,
                DateTime.UtcNow,
                null
            );
        }

        [Fact]
        public void Constructor_WithValidDTO_MapsPropertiesCorrectly()
        {
            // Arrange
            var dto = CreateMockNotificationDTO();

            // Act
            var notification = new Notification(dto);

            // Assert
            Assert.Equal(dto.Id, notification.Id);
            Assert.Equal(dto.UserId, notification.UserId);
            Assert.Equal(dto.Title, notification.Title);
            Assert.Equal(dto.Message, notification.Message);
            Assert.Equal(dto.Type, notification.Type);
            Assert.Equal(dto.EntityType, notification.EntityType);
            Assert.Equal(dto.EntityId, notification.EntityId);
            Assert.Equal(dto.IsRead, notification.IsRead);
            Assert.Equal(dto.CreatedBy, notification.CreatedBy);
            Assert.Equal(dto.CreatedAt, notification.CreatedAt);
            Assert.Equal(dto.ReadAt, notification.ReadAt);
        }

        [Fact]
        public void NDTO_Property_ReturnsCorrectDTOMapping()
        {
            // Arrange
            var dto = CreateMockNotificationDTO();
            var notification = new Notification(dto);

            // Act
            var resultDto = notification.NDTO;

            // Assert
            Assert.Equal(notification.Id, resultDto.Id);
            Assert.Equal(notification.UserId, resultDto.UserId);
            Assert.Equal(notification.Title, resultDto.Title);
            Assert.Equal(notification.Message, resultDto.Message);
            Assert.Equal(notification.Type, resultDto.Type);
            Assert.Equal(notification.EntityType, resultDto.EntityType);
            Assert.Equal(notification.EntityId, resultDto.EntityId);
            Assert.Equal(notification.IsRead, resultDto.IsRead);
            Assert.Equal(notification.CreatedBy, resultDto.CreatedBy);
            Assert.Equal(notification.CreatedAt, resultDto.CreatedAt);
            Assert.Equal(notification.ReadAt, resultDto.ReadAt);
        }
    }
}
