using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
public class UserOwnerOrAdminHandler : AuthorizationHandler<UserOwnerOrAdminRequirement, int>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserOwnerOrAdminRequirement requirement, int resourceId)
    {
        // Check if the user is in the "Admin" role
        if (context.User.IsInRole("Admin"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        // If not an admin, check if the user is the owner of the resource
        string userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
        {
            if (userId == resourceId)
            {
                context.Succeed(requirement);
            }
        }
        return Task.CompletedTask;
    }
}

