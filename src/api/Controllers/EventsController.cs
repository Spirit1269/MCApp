using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorcycleClubHub.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MotorcycleClubHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            // Get user's email from the token
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(userEmail))
                return Forbid();

            // Get the user's member record
            var member = await _context.Members
                .FirstOrDefaultAsync(m => m.Email == userEmail);

            if (member == null)
                return NotFound("Member profile not found");

            // Get the member's chapter
            var chapter = await _context.Chapters
                .FirstOrDefaultAsync(c => c.Id == member.ChapterId);

            if (chapter == null)
                return NotFound("Chapter not found");

            // Get the chapter's district
            var district = await _context.Districts
                .FirstOrDefaultAsync(d => d.Id == chapter.DistrictId);

            if (district == null)
                return NotFound("District not found");

            // Get events visible to this member based on scope
            var events = await _context.Events
                .Where(e => 
                    // Club events
                    (e.ScopeType == "club" && e.ScopeId == district.ClubId) ||
                    // District events
                    (e.ScopeType == "district" && e.ScopeId == district.Id) ||
                    // Chapter events
                    (e.ScopeType == "chapter" && e.ScopeId == chapter.Id))
                .OrderByDescending(e => e.StartsAt)
                .ToListAsync();

            return events;
        }

        // GET: api/events/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(string id)
        {
            var @event = await _context.Events.FindAsync(id);
            
            if (@event == null)
                return NotFound();

            // Get user's email from the token
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var member = await _context.Members
                .FirstOrDefaultAsync(m => m.Email == userEmail);

            if (member == null)
                return Forbid();

            // Get the member's chapter
            var chapter = await _context.Chapters
                .FirstOrDefaultAsync(c => c.Id == member.ChapterId);

            if (chapter == null)
                return NotFound("Chapter not found");

            // Get the chapter's district
            var district = await _context.Districts
                .FirstOrDefaultAsync(d => d.Id == chapter.DistrictId);

            if (district == null)
                return NotFound("District not found");

            // Check if the event is visible to this member
            if (
                // Club events
                (@event.ScopeType == "club" && @event.ScopeId == district.ClubId) ||
                // District events
                (@event.ScopeType == "district" && @event.ScopeId == district.Id) ||
                // Chapter events
                (@event.ScopeType == "chapter" && @event.ScopeId == chapter.Id))
            {
                return @event;
            }

            return Forbid();
        }

        // POST: api/events
        [HttpPost]
        public async Task<ActionResult<Event>> CreateEvent(Event @event)
        {
            // Get user's email from the token
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var member = await _context.Members
                .Include(m => m.Roles)
                .FirstOrDefaultAsync(m => m.Email == userEmail);

            if (member == null)
                return Forbid();

            // Check if user has permission to create an event for this scope
            var hasPermission = false;
            
            if (@event.ScopeType == "club")
            {
                // Only club officers can create club events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "club" && 
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer" ||
                     r.RoleName == "Board Member"));
            }
            else if (@event.ScopeType == "district")
            {
                // Only district officers can create district events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "district" && 
                    r.ScopeId == @event.ScopeId &&
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer"));
            }
            else if (@event.ScopeType == "chapter")
            {
                // Only chapter officers can create chapter events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "chapter" && 
                    r.ScopeId == @event.ScopeId &&
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer" ||
                     r.RoleName == "Road Captain"));
            }

            if (!hasPermission)
                return Forbid();

            // Set the creator
            @event.CreatedBy = member.Id;
            
            _context.Events.Add(@event);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = @event.Id }, @event);
        }

        // PUT: api/events/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(string id, Event @event)
        {
            if (id != @event.Id)
                return BadRequest();

            // Get user's email from the token
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var member = await _context.Members
                .Include(m => m.Roles)
                .FirstOrDefaultAsync(m => m.Email == userEmail);

            if (member == null)
                return Forbid();

            // Get the existing event
            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return NotFound();

            // Check if user has permission to update this event
            var hasPermission = false;
            
            // Check if user created the event
            if (existingEvent.CreatedBy == member.Id)
            {
                hasPermission = true;
            }
            else if (existingEvent.ScopeType == "club")
            {
                // Only club officers can update club events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "club" && 
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer" ||
                     r.RoleName == "Board Member"));
            }
            else if (existingEvent.ScopeType == "district")
            {
                // Only district officers can update district events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "district" && 
                    r.ScopeId == existingEvent.ScopeId &&
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer"));
            }
            else if (existingEvent.ScopeType == "chapter")
            {
                // Only chapter officers can update chapter events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "chapter" && 
                    r.ScopeId == existingEvent.ScopeId &&
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer" ||
                     r.RoleName == "Road Captain"));
            }

            if (!hasPermission)
                return Forbid();

            // Don't allow changing the created by field
            @event.CreatedBy = existingEvent.CreatedBy;
            
            _context.Entry(existingEvent).State = EntityState.Detached;
            _context.Entry(@event).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/events/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(string id)
        {
            var @event = await _context.Events.FindAsync(id);
            if (@event == null)
                return NotFound();

            // Get user's email from the token
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var member = await _context.Members
                .Include(m => m.Roles)
                .FirstOrDefaultAsync(m => m.Email == userEmail);

            if (member == null)
                return Forbid();

            // Check if user has permission to delete this event
            var hasPermission = false;
            
            // Check if user created the event
            if (@event.CreatedBy == member.Id)
            {
                hasPermission = true;
            }
            else if (@event.ScopeType == "club")
            {
                // Only club officers can delete club events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "club" && 
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer" ||
                     r.RoleName == "Board Member"));
            }
            else if (@event.ScopeType == "district")
            {
                // Only district officers can delete district events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "district" && 
                    r.ScopeId == @event.ScopeId &&
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer"));
            }
            else if (@event.ScopeType == "chapter")
            {
                // Only chapter officers can delete chapter events
                hasPermission = member.Roles.Any(r => 
                    r.ScopeType == "chapter" && 
                    r.ScopeId == @event.ScopeId &&
                    (r.RoleName == "President" || r.RoleName == "Vice President" || 
                     r.RoleName == "Secretary" || r.RoleName == "Treasurer" ||
                     r.RoleName == "Road Captain"));
            }

            if (!hasPermission)
                return Forbid();

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(string id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}