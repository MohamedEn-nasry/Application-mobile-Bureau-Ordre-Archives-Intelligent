
using DTO.Courriers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Authorization
{
    public class CourrierOwnerOrAdminHandler
        : AuthorizationHandler<CourrierOwnerOrAdminRequirement, CourrierDTO>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            CourrierOwnerOrAdminRequirement requirement,
            CourrierDTO courrier)
        {
            if (context.User.IsInRole("Admin"))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            var userIdValue = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdValue, out int currentUserId))
                return Task.CompletedTask;

            bool isAuteur = courrier.AuteurId == currentUserId;
            bool isAssigne = courrier.AssigneA.HasValue && courrier.AssigneA.Value == currentUserId;

            if (isAuteur || isAssigne)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}