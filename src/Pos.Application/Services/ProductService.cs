using Pos.Application.DTOs;
using Pos.Application.Interfaces;
using Pos.Domain.Entities;

namespace Pos.Application.Services;

public class ProductService(IProductRepository productRepository, IUnitOfWork unitOfWork) : IProductService
{
    public async Task<IReadOnlyList<ProductResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var products = await productRepository.GetAllAsync(cancellationToken);
        return products.Select(Map).ToList();
    }

    public async Task<ProductResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        return product is null ? null : Map(product);
    }

    public async Task<ProductResponseDto> CreateAsync(CreateProductDto request, CancellationToken cancellationToken = default)
    {
        var existing = await productRepository.GetByBarcodeAsync(request.Barcode, cancellationToken);
        if (existing is not null)
        {
            throw new InvalidOperationException($"Barcode '{request.Barcode}' already exists.");
        }

        var product = new Product
        {
            Name = request.Name.Trim(),
            Barcode = request.Barcode.Trim(),
            Price = request.Price,
            Stock = request.Stock
        };

        await productRepository.AddAsync(product, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Map(product);
    }

    public async Task<ProductResponseDto?> UpdateAsync(Guid id, UpdateProductDto request, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null) return null;

        var existing = await productRepository.GetByBarcodeAsync(request.Barcode, cancellationToken);
        if (existing is not null && existing.Id != id)
        {
            throw new InvalidOperationException($"Barcode '{request.Barcode}' already exists.");
        }

        product.Name = request.Name.Trim();
        product.Barcode = request.Barcode.Trim();
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.IsActive = request.IsActive;
        product.UpdatedAtUtc = DateTime.UtcNow;

        await productRepository.UpdateAsync(product, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(product);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null) return false;

        await productRepository.DeleteAsync(product, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ProductResponseDto Map(Product product)
        => new(product.Id, product.Name, product.Barcode, product.Price, product.Stock, product.IsActive);
}
