using Microsoft.EntityFrameworkCore;
using Pos.Application.Interfaces;
using Pos.Domain.Entities;
using Pos.Infrastructure.Data;

namespace Pos.Infrastructure.Repositories;

public class CustomerRepository(PosDbContext dbContext) : ICustomerRepository
{
    public async Task<IReadOnlyList<Customer>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.Customers.AsNoTracking().OrderBy(x => x.FullName).ToListAsync(cancellationToken);

    public async Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await dbContext.Customers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(Customer customer, CancellationToken cancellationToken = default)
        => await dbContext.Customers.AddAsync(customer, cancellationToken);

    public Task UpdateAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        dbContext.Customers.Update(customer);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        dbContext.Customers.Remove(customer);
        return Task.CompletedTask;
    }
}
