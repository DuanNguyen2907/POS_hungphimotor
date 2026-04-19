using Pos.Application.DTOs;

namespace Pos.Application.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> CreateAsync(CreateOrderDto request, CancellationToken cancellationToken = default);
    Task<OrderResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
