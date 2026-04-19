using Pos.Application.DTOs;

namespace Pos.Application.Interfaces;

public interface ICustomerService
{
    Task<IReadOnlyList<CustomerResponseDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<CustomerResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CustomerResponseDto> CreateAsync(CreateCustomerDto request, CancellationToken cancellationToken = default);
    Task<CustomerResponseDto?> UpdateAsync(Guid id, UpdateCustomerDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
