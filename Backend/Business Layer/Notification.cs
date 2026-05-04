using Data_Access;
using DTO.Notifications;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business_Layer
{
    public class Notification
    {
        public enum enMode { AddNew = 0 }

        public enMode Mode = enMode.AddNew;

        public NotificationDTO NDTO
        {
            get
            {
                return new NotificationDTO(
                    this.Id,
                    this.UserId,
                    this.Title,
                    this.Message,
                    this.Type,
                    this.EntityType,
                    this.EntityId,
                    this.IsRead,
                    this.CreatedBy,
                    this.CreatedAt,
                    this.ReadAt
                );
            }
        }

        public int Id { get; set; }

        public int UserId { get; set; }

        public string Title { get; set; }

        public string Message { get; set; }

        public string Type { get; set; }

        public string? EntityType { get; set; }

        public int? EntityId { get; set; }

        public bool IsRead { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? ReadAt { get; set; }

        public Notification(NotificationDTO dto)
        {
            Id = dto.Id;
            UserId = dto.UserId;
            Title = dto.Title;
            Message = dto.Message;
            Type = dto.Type;
            EntityType = dto.EntityType;
            EntityId = dto.EntityId;
            IsRead = dto.IsRead;
            CreatedBy = dto.CreatedBy;
            CreatedAt = dto.CreatedAt;
            ReadAt = dto.ReadAt;
        }

        private bool _AddNewNotification()
        {
            this.Id = NotificationData.AddNotification(this.NDTO);

            return this.Id != -1;
        }

        public bool Save()
        {
            return _AddNewNotification();
        }

        public static List<NotificationDTO> GetByUser(int userId, bool onlyUnread = false)
        {
            return NotificationData.GetNotificationsByUser(userId, onlyUnread);
        }

        public static int GetUnreadCount(int userId)
        {
            return NotificationData.GetUnreadNotificationsCount(userId);
        }

        public static bool MarkAsRead(int id, int userId)
        {
            return NotificationData.MarkAsRead(id, userId);
        }

        public static bool MarkAllAsRead(int userId)
        {
            return NotificationData.MarkAllAsRead(userId);
        }

        public static bool Delete(int id, int userId)
        {
            return NotificationData.DeleteNotification(id, userId);
        }

        public static bool CreateForUser(
            int userId,
            string title,
            string message,
            string type,
            string? entityType = null,
            int? entityId = null,
            int? createdBy = null)
        {
            var dto = new NotificationDTO(
                0,
                userId,
                title,
                message,
                type,
                entityType,
                entityId,
                false,
                createdBy,
                DateTime.UtcNow,
                null
            );

            var notification = new Notification(dto);

            return notification.Save();
        }
    }
}
