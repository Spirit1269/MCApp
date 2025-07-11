// Api/Controllers/DuesController.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MotorcycleClubHub.Api.Interfaces;
using MotorcycleClubHub.Data;

namespace MotorcycleClubHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DuesController : ControllerBase
    {
        private readonly IDuesService _duesService;
        private readonly IClubContextService _clubContext;

        public DuesController(IDuesService duesService, IClubContextService clubContext)
        {
            _duesService = duesService;
            _clubContext = clubContext;
        }

        /// <summary>
        /// GET api/dues/invoices?chapterId=... 
        /// Lists all invoices for the officer’s scope.
        /// </summary>
        [HttpGet("invoices")]
        public async Task<ActionResult<IEnumerable<DuesInvoice>>> GetInvoices([FromQuery] string? chapterId = null)
        {
            var clubId = _clubContext.ClubId;
            var invoices = await _duesService.GetInvoicesForScopeAsync(clubId, chapterId);
            return Ok(invoices);
        }

        /// <summary>
        /// GET api/dues/members/{memberId}/invoices
        /// Lists all invoices for a single member.
        /// </summary>
        [HttpGet("members/{memberId}/invoices")]
        public async Task<ActionResult<IEnumerable<DuesInvoice>>> GetMemberInvoices(string memberId)
        {
            var invoices = await _duesService.GetInvoicesForMemberAsync(memberId);
            return Ok(invoices);
        }

        /// <summary>
        /// POST api/dues/invoices
        /// Create a new invoice.
        /// </summary>
        [HttpPost("invoices")]
        public async Task<ActionResult<DuesInvoice>> CreateInvoice([FromBody] DuesInvoice invoice)
        {
            var created = await _duesService.CreateInvoiceAsync(invoice);
            return CreatedAtAction(nameof(GetInvoices), new { }, created);
        }

        /// <summary>
        /// POST api/dues/invoices/{invoiceId}/pay
        /// Mark an invoice as paid.
        /// </summary>
        [HttpPost("invoices/{invoiceId}/pay")]
        public async Task<IActionResult> PayInvoice(string invoiceId)
        {
            await _duesService.PayInvoiceAsync(invoiceId);
            return NoContent();
        }

        /// <summary>
        /// POST api/dues/invoices/{invoiceId}/cancel
        /// Cancel an invoice.
        /// </summary>
        [HttpPost("invoices/{invoiceId}/cancel")]
        public async Task<IActionResult> CancelInvoice(string invoiceId)
        {
            await _duesService.CancelInvoiceAsync(invoiceId);
            return NoContent();
        }
    }
}
