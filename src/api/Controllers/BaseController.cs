using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using MotorcycleClubHub.Data;
using System.Linq;

namespace MotorcycleClubHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public abstract class BaseController : ControllerBase
    {
        protected string GetCurrentClubId()
        {
            return User.Claims.FirstOrDefault(c => c.Type == "club_id")?.Value ?? string.Empty;
        }

        protected string GetCurrentUserId()
        {
            return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        protected string GetCurrentUserEmail()
        {
            return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value ?? string.Empty;
        }
    }
}
