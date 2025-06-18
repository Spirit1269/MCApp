using MotorcycleClubHub.Api.Interfaces;
using System.Security.Claims;

namespace MotorcycleClubHub.Api.Services
{
    public class ClubContextService : IClubContextService
    {
        public string ClubId { get; }
        public string UserId { get; }
        public string Email { get; }

        public ClubContextService(IHttpContextAccessor accessor)
        {
            var user = accessor.HttpContext?.User;

            ClubId = user?.Claims.FirstOrDefault(c => c.Type == "club_id")?.Value ?? "";
            UserId = user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
            Email = user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value ?? "";
        }
    }
}
