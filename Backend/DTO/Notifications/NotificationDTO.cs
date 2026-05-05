using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Notifications
{
      public class NotificationDTO
        {
            public int Id { get; set; }

            public int UserId { get; set; }

            public string Title { get; set; } = string.Empty;

            public string Message { get; set; } = string.Empty;

            public string Type { get; set; } = string.Empty;

            public string? EntityType { get; set; }

            public int? EntityId { get; set; }

            public bool IsRead { get; set; }

            public int? CreatedBy { get; set; }

            public DateTime CreatedAt { get; set; }

            public DateTime? ReadAt { get; set; }

            public NotificationDTO(
                int id,
                int userId,
                string title,
                string message,
                string type,
                string? entityType,
                int? entityId,
                bool isRead,
                int? createdBy,
                DateTime createdAt,
                DateTime? readAt)
            {
                Id = id;
                UserId = userId;
                Title = title;
                Message = message;
                Type = type;
                EntityType = entityType;
                EntityId = entityId;
                IsRead = isRead;
                CreatedBy = createdBy;
                CreatedAt = createdAt;
                ReadAt = readAt;
            }
        }
    
}
