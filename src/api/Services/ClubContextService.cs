using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Data;
using System.Security.Claims;

namespace MotorcycleClubHub.Api.Services
{
    public class ClubContextService : IClubContextService
    {
        public string ClubId { get; } = string.Empty;
        public string UserId { get; } = string.Empty;
        public string Email { get; } = string.Empty;
        private readonly ApplicationDbContext _ctx;

        public IQueryable<Club> Clubs => _ctx.Clubs;

        public void AddClub(Club club) => _ctx.Clubs.Add(club);
        public int SaveChanges() => _ctx.SaveChanges();

        public ClubContextService(IHttpContextAccessor accessor, ApplicationDbContext ctx)
        {
            _ctx = ctx;
            var user = accessor.HttpContext?.User;
            ClubId = user?.Claims.FirstOrDefault(c => c.Type == "club_id")?.Value ?? string.Empty;
            UserId = user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            Email = user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value ?? string.Empty;
        }
        
    }
}
