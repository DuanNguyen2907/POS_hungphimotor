using Microsoft.EntityFrameworkCore;
using Pos.Application.Interfaces;
using Pos.Domain.Entities;
using Pos.Infrastructure.Data;

namespace Pos.Infrastructure.Repositories;

public class ProductRepository(PosDbContext dbContext) : IProductRepository
{
    public async Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.Products.AsNoTracking().OrderBy(x => x.Name).ToListAsync(cancellationToken);

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await dbContext.Products.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<Product?> GetByBarcodeAsync(string barcode, CancellationToken cancellationToken = default)
        => await dbContext.Products.FirstOrDefaultAsync(x => x.Barcode == barcode, cancellationToken);

    public async Task AddAsync(Product product, CancellationToken cancellationToken = default)
        => await dbContext.Products.AddAsync(product, cancellationToken);

    public Task UpdateAsync(Product product, CancellationToken cancellationToken = default)
    {
        dbContext.Products.Update(product);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Product product, CancellationToken cancellationToken = default)
    {
        dbContext.Products.Remove(product);
        return Task.CompletedTask;
    }
}
