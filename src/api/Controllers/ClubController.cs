using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Data;             // For ApplicationDbContext

namespace MotorcycleClubHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  // require a logged-in user
    public class ClubController : ControllerBase
    {
        private readonly IClubContextService _clubContext;
        private readonly ApplicationDbContext   _context;

        public ClubController(
            IClubContextService clubContext,
            ApplicationDbContext  context)
        {
            _clubContext = clubContext;
            _context     = context;
        }

        [HttpGet("status")]
        public IActionResult GetClubSetupStatus()
        {
            // still global, not per-club
            var isSetup = _context.Clubs.Any(c => c.IsSetup);
            return Ok(new { isSetup });
        }

        [HttpGet("my-club")]
        public IActionResult GetMyClub()
        {
            // now using your service
            var clubId = _clubContext.ClubId;
            if (string.IsNullOrEmpty(clubId))
                return Unauthorized("Club ID missing from token");

            var club = _context.Clubs.Find(clubId);
            if (club is null)
                return NotFound("Club not found");

            return Ok(club);
        }

        [HttpPost("setup")]
        public IActionResult SetupClub([FromBody] Club club)
        {
            if (_context.Clubs.Any(c => c.IsSetup))
                return BadRequest("Club is already set up.");

            club.IsSetup  = true;
            club.CreatedAt = DateTime.UtcNow;
            _context.Clubs.Add(club);
            _context.SaveChanges();

            return CreatedAtAction(
                nameof(GetMyClub),
                new { },
                club
            );
        }
    }
}
