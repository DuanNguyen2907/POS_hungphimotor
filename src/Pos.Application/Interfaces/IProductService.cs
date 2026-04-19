using Pos.Application.DTOs;

namespace Pos.Application.Interfaces;

public interface IProductService
{
    Task<IReadOnlyList<ProductResponseDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductResponseDto> CreateAsync(CreateProductDto request, CancellationToken cancellationToken = default);
    Task<ProductResponseDto?> UpdateAsync(Guid id, UpdateProductDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
