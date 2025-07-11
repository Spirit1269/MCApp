// Api/Services/DuesService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Data;
using MotorcycleClubHub.Api.Data;

namespace MotorcycleClubHub.Api.Services
{
    public class DuesService : IDuesService
    {
        private readonly ApplicationDbContext _context;

        public DuesService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DuesInvoice>> GetInvoicesForScopeAsync(string clubId, string? chapterId = null)
        {
            var query = _context.DuesInvoices.AsQueryable();

            if (!string.IsNullOrEmpty(chapterId))
            {
                // Chapter‐scoped
                query = query.Where(i => i.ChapterId == chapterId);
            }
            else
            {
                // Club‐scoped: find all chapters in this club
                var chapterIds = await _context.Chapters
                    .Where(c => c.Id == clubId)
                    .Select(c => c.Id)
                    .ToListAsync();
                query = query.Where(i => chapterIds.Contains(i.ChapterId));
            }

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<DuesInvoice>> GetInvoicesForMemberAsync(string memberId)
        {
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return Enumerable.Empty<DuesInvoice>();

            return await _context.DuesInvoices
                .Where(i => i.ChapterId == member.ChapterId)
                .ToListAsync();
        }

        public async Task<DuesInvoice> CreateInvoiceAsync(DuesInvoice invoice)
        {
            invoice.Id = Guid.NewGuid().ToString();
            _context.DuesInvoices.Add(invoice);
            await _context.SaveChangesAsync();
            return invoice;
        }

        public async Task PayInvoiceAsync(string invoiceId)
        {
            var invoice = await _context.DuesInvoices.FindAsync(invoiceId)
                          ?? throw new KeyNotFoundException($"Invoice {invoiceId} not found");
            invoice.Status = "paid";
            await _context.SaveChangesAsync();
        }

        public async Task CancelInvoiceAsync(string invoiceId)
        {
            var invoice = await _context.DuesInvoices.FindAsync(invoiceId)
                          ?? throw new KeyNotFoundException($"Invoice {invoiceId} not found");
            invoice.Status = "cancelled";
            await _context.SaveChangesAsync();
        }
    }
}
