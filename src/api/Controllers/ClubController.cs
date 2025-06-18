using Microsoft.AspNetCore.Mvc;
using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Data;
using System.Linq;

namespace MotorcycleClubHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubController : ControllerBase
    {
        private readonly IClubContextService _clubContext;

        

        private readonly ApplicationDbContext _context;

        public ClubController(ApplicationDbContext context)
        {
            _context = context;
        }
        // ✅ ClubId extraction from claims
        public string GetCurrentClubId()
        {
            return User.Claims.FirstOrDefault(c => c.Type == "club_id")?.Value ?? string.Empty;
        }

        [HttpGet("status")]
        public IActionResult GetClubSetupStatus()
        {
            var isSetup = _context.Clubs.Any(c => c.IsSetup);
            return Ok(new { isSetup });
        }

        [HttpGet("my-club")]
        public IActionResult GetMyClub()
        {
            var clubId = GetCurrentClubId();

            if (string.IsNullOrEmpty(clubId))
                return Unauthorized("Club ID missing from token");

            var club = _context.Clubs.FirstOrDefault(c => c.Id == clubId);
            if (club == null)
                return NotFound("Club not found");

            return Ok(club);
        }

        [HttpPost("setup")]
        public IActionResult SetupClub([FromBody] Club club)
        {
            if (_context.Clubs.Any(c => c.IsSetup))
                return BadRequest("Club is already set up.");

            club.IsSetup = true;
            club.CreatedAt = DateTime.UtcNow;
            _context.Clubs.Add(club);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetClubSetupStatus), new { }, club);
        }
    }
}
