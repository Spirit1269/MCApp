using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorcycleClubHub.Api.Interfaces;
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
    public class MembersController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemberService _memberService;

        public MembersController(ApplicationDbContext context, IMemberService memberService)
        {
            _context = context;
            _memberService = memberService;
        }

        // GET: api/members
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers()
        {
            // Get user's email from the token
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(userEmail))
                return Forbid();

            // Get the user's member record
            var member = await _context.Members
                .Include(m => m.Roles)
                .FirstOrDefaultAsync(m => m.Email == userEmail);

            if (member == null)
                return NotFound("Member profile not found");

            // Check if user has any admin roles
            var isAdmin = member.Roles.Any(r =>
                r.RoleName == "President" ||
                r.RoleName == "Vice President" ||
                r.RoleName == "Secretary" ||
                r.RoleName == "Treasurer" ||
                r.RoleName == "Board Member");

            if (isAdmin)
            {
                // Admins can see all members based on their scope
                var adminRoles = member.Roles.Where(r =>
                    r.RoleName == "President" ||
                    r.RoleName == "Vice President" ||
                    r.RoleName == "Secretary" ||
                    r.RoleName == "Treasurer" ||
                    r.RoleName == "Board Member");

                var members = new List<Member>();

                foreach (var role in adminRoles)
                {
                    if (role.ScopeType == "club")
                    {
                        // Club admins can see all members
                        return await _context.Members.ToListAsync();
                    }
                    else if (role.ScopeType == "district")
                    {
                        // District admins can see members in their district
                        var chapters = await _context.Chapters
                            .Where(c => c.DistrictId == role.ScopeId)
                            .Select(c => c.Id)
                            .ToListAsync();

                        var districtMembers = await _context.Members
                            .Where(m => chapters.Contains(m.ChapterId))
                            .ToListAsync();

                        members.AddRange(districtMembers);
                    }
                    else if (role.ScopeType == "chapter")
                    {
                        // Chapter admins can see members in their chapter
                        var chapterMembers = await _context.Members
                            .Where(m => m.ChapterId == role.ScopeId)
                            .ToListAsync();

                        members.AddRange(chapterMembers);
                    }
                }

                return members.Distinct().ToList();
            }
            else
            {
                // Regular members can only see members in their chapter
                return await _context.Members
                    .Where(m => m.ChapterId == member.ChapterId)
                    .ToListAsync();
            }
        }

       [HttpGet("my-members")]
        public async Task<IActionResult> GetMyMembers()
        {
            var member = await _memberService.GetCurrentMemberAsync();
            if (member == null) return Forbid();

            var clubId = await _memberService.GetClubIdForMemberAsync(member);
            if (string.IsNullOrEmpty(clubId)) return NotFound("Unable to resolve club");

            var memberChapterIds = await _context.Chapters
                .Where(c => _context.Districts
                    .Any(d => d.Id == c.DistrictId && d.ClubId == clubId))
                .Select(c => c.Id)
                .ToListAsync();

            var members = await _context.Members
                .Where(m => memberChapterIds.Contains(m.ChapterId))
                .ToListAsync();

            return Ok(members);
        }


        // GET: api/members/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await _context.Members.FindAsync(id);

            if (member == null)
                return NotFound();

            // Check if the user is requesting their own profile
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var currentMember = await _context.Members
                .Include(m => m.Roles)
                .FirstOrDefaultAsync(m => m.Email == userEmail);

            if (currentMember == null)
                return Forbid();

            // Allow users to see their own profile
            if (currentMember.Id == id)
                return member;

            // Check if user has admin rights to view this member
            var isAdmin = false;

            foreach (var role in currentMember.Roles)
            {
                if (role.ScopeType == "club" &&
                    (role.RoleName == "President" || role.RoleName == "Vice President" ||
                     role.RoleName == "Secretary" || role.RoleName == "Treasurer" || role.RoleName == "Board Member"))
                {
                    isAdmin = true;
                    break;
                }
                else if (role.ScopeType == "district" &&
                         (role.RoleName == "President" || role.RoleName == "Vice President" ||
                          role.RoleName == "Secretary" || role.RoleName == "Treasurer"))
                {
                    // Check if member belongs to a chapter in this district
                    var chapter = await _context.Chapters.FindAsync(member.ChapterId);
                    if (chapter != null && chapter.DistrictId == role.ScopeId)
                    {
                        isAdmin = true;
                        break;
                    }
                }
                else if (role.ScopeType == "chapter" &&
                         (role.RoleName == "President" || role.RoleName == "Vice President" ||
                          role.RoleName == "Secretary" || role.RoleName == "Treasurer"))
                {
                    // Check if member belongs to this chapter
                    if (member.ChapterId == role.ScopeId)
                    {
                        isAdmin = true;
                        break;
                    }
                }
            }

            if (!isAdmin)
            {
                // Check if they are in the same chapter
                if (currentMember.ChapterId != member.ChapterId)
                    return Forbid();
            }

            return member;
        }

        // PUT: api/members/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(string id, Member member)
        {
            if (id != member.Id)
                return BadRequest();

            // Check if the user is updating their own profile
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var currentMember = await _context.Members
                .Include(m => m.Roles)
                .FirstOrDefaultAsync(m => m.Email == userEmail);

            if (currentMember == null)
                return Forbid();

            // Allow users to update their own profile
            if (currentMember.Id == id)
            {
                // Only allow updating specific fields for own profile
                var dbMember = await _context.Members.FindAsync(id);
                if (dbMember == null)
                    return NotFound();

                dbMember.DisplayName = member.DisplayName;
                dbMember.AvatarUrl = member.AvatarUrl;

                // Don't allow changing chapter or other critical fields

                _context.Entry(dbMember).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MemberExists(id))
                        return NotFound();
                    else
                        throw;
                }

                return NoContent();
            }

            // Check if user has admin rights to update this member
            var isAdmin = false;

            foreach (var role in currentMember.Roles)
            {
                if (role.ScopeType == "club" &&
                    (role.RoleName == "President" || role.RoleName == "Vice President" ||
                     role.RoleName == "Secretary" || role.RoleName == "Treasurer" || role.RoleName == "Board Member"))
                {
                    isAdmin = true;
                    break;
                }
                else if (role.ScopeType == "district" &&
                         (role.RoleName == "President" || role.RoleName == "Vice President" ||
                          role.RoleName == "Secretary" || role.RoleName == "Treasurer"))
                {
                    // Check if member belongs to a chapter in this district
                    var dbMember = await _context.Members.FindAsync(id);
                    if (dbMember == null)
                        return NotFound();

                    var chapter = await _context.Chapters.FindAsync(dbMember.ChapterId);
                    if (chapter != null && chapter.DistrictId == role.ScopeId)
                    {
                        isAdmin = true;
                        break;
                    }
                }
                else if (role.ScopeType == "chapter" &&
                         (role.RoleName == "President" || role.RoleName == "Vice President" ||
                          role.RoleName == "Secretary" || role.RoleName == "Treasurer"))
                {
                    // Check if member belongs to this chapter
                    var dbMember = await _context.Members.FindAsync(id);
                    if (dbMember != null && dbMember.ChapterId == role.ScopeId)
                    {
                        isAdmin = true;
                        break;
                    }
                }
            }

            if (!isAdmin)
                return Forbid();

            _context.Entry(member).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/members
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Member>> CreateMember(Member member)
        {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMember), new { id = member.Id }, member);
        }

        // DELETE: api/members/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteMember(string id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
                return NotFound();

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MemberExists(string id)
        {
            return _context.Members.Any(e => e.Id == id);
        }
        
    }
}