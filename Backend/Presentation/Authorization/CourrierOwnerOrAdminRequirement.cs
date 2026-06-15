using Microsoft.AspNetCore.Authorization;

namespace backend.Authorization
{
    public class CourrierOwnerOrAdminRequirement : IAuthorizationRequirement
    {
    }
}