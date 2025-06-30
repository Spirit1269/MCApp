using Microsoft.EntityFrameworkCore;
using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Data;
using System.Threading.Tasks;

namespace MotorcycleClubHub.Api.Services
{
    public class MemberService : IMemberService
    {
        private readonly ApplicationDbContext _context;
        private readonly IClubContextService _clubContext;

        public MemberService(ApplicationDbContext context, IClubContextService clubContext)
        {
            _context = context;
            _clubContext = clubContext;
        }

        public async Task<Member?> GetCurrentMemberAsync()
        {
            var email = _clubContext.Email;
            if (string.IsNullOrEmpty(email)) return null;

            return await _context.Members
                .Include(m => m.Roles)
                .FirstOrDefaultAsync(m => m.Email == email);
        }

        public async Task<string?> GetClubIdForMemberAsync(Member member)
        {
            var chapter = await _context.Chapters.FirstOrDefaultAsync(c => c.Id == member.ChapterId);
            if (chapter == null) return null;

            var district = await _context.Districts.FirstOrDefaultAsync(d => d.Id == chapter.DistrictId);
            return district?.ClubId;
        }
    }
}
