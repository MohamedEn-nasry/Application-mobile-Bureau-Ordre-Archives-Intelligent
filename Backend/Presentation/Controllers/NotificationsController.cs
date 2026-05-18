using Business_Layer;
using BusinessLayer;
using Data_Access;
using DTO.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Npgsql;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/Notifications")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetMyNotifications([FromQuery] bool onlyUnread = false)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var notifications = Notification.GetByUser(userId.Value, onlyUnread);

            return Ok(notifications);
        }

        [HttpGet("unread-count")]
        public IActionResult GetUnreadCount()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var count = Notification.GetUnreadCount(userId.Value);

            return Ok(new { count });
        }

        [HttpPut("{id:int}/read")]
        public IActionResult MarkAsRead(int id)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var updated = Notification.MarkAsRead(id, userId.Value);

            if (!updated)
                return NotFound(new { message = "Notification introuvable." });

            return NoContent();
        }

        [HttpPut("read-all")]
        public IActionResult MarkAllAsRead()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            Notification.MarkAllAsRead(userId.Value);

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var deleted = Notification.Delete(id, userId.Value);

            if (!deleted)
                return NotFound(new { message = "Notification introuvable." });

            return NoContent();
        }

  
       
        [HttpGet("lecteur")]
        [Authorize(Roles = "Lecteur")]
        public IActionResult GetLecteurNotifications()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            int? categorieId;
            try
            {
                categorieId = Notification.getCategorieIdByUserId(userId.Value);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la récupération de la catégorie de l'utilisateur.", details = ex.Message });
            }

            
      

            var result =
                Notification.GetLecteurNotificationsByCategorie(categorieId.Value);

            return Ok(result);
        }
     

        private int? GetCurrentUserId()
        {
            var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdValue, out int userId))
                return userId;

            return null;
        }
    }
}