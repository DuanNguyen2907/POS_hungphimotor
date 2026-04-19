using Microsoft.EntityFrameworkCore;
using Pos.Application.Interfaces;
using Pos.Domain.Entities;
using Pos.Infrastructure.Data;

namespace Pos.Infrastructure.Repositories;

public class OrderRepository(PosDbContext dbContext) : IOrderRepository
{
    public async Task AddAsync(Order order, CancellationToken cancellationToken = default)
        => await dbContext.Orders.AddAsync(order, cancellationToken);

    public async Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await dbContext.Orders
            .Include(x => x.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
}
