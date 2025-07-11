using MotorcycleClubHub.Data;
using System.Threading.Tasks;

namespace MotorcycleClubHub.Api.Interfaces
{
    public interface IDuesService
    {
        /// <summary>
        /// List all invoices in the officer’s scope (chapter if specified, otherwise entire club).
        /// </summary>
        Task<IEnumerable<DuesInvoice>> GetInvoicesForScopeAsync(string clubId, string? chapterId = null);

        /// <summary>
        /// List all invoices for a single member.
        /// </summary>
        Task<IEnumerable<DuesInvoice>> GetInvoicesForMemberAsync(string memberId);

        /// <summary>
        /// Create a new dues invoice.
        /// </summary>
        Task<DuesInvoice> CreateInvoiceAsync(DuesInvoice invoice);

        /// <summary>
        /// Mark an invoice as paid.
        /// </summary>
        Task PayInvoiceAsync(string invoiceId);

        /// <summary>
        /// Cancel an invoice.
        /// </summary>
        Task CancelInvoiceAsync(string invoiceId);
    }
}
