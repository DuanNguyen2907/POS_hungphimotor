using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pos.Application.DTOs;
using Pos.Application.Interfaces;

namespace Pos.Api.Controllers;

[ApiController]
[Route("api/customers")]
[Authorize(Policy = "StaffOrAdmin")]
public class CustomersController(ICustomerService customerService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CustomerResponseDto>>> GetAll(CancellationToken cancellationToken)
        => Ok(await customerService.GetAllAsync(cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CustomerResponseDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var customer = await customerService.GetByIdAsync(id, cancellationToken);
        return customer is null ? NotFound() : Ok(customer);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CustomerResponseDto>> Create([FromBody] CreateCustomerDto request, CancellationToken cancellationToken)
    {
        var created = await customerService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CustomerResponseDto>> Update(Guid id, [FromBody] UpdateCustomerDto request, CancellationToken cancellationToken)
    {
        var updated = await customerService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        => await customerService.DeleteAsync(id, cancellationToken) ? NoContent() : NotFound();
}
