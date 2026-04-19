using Pos.Application.Interfaces;
using Pos.Infrastructure.Data;

namespace Pos.Infrastructure.Repositories;

public class UnitOfWork(PosDbContext dbContext) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => dbContext.SaveChangesAsync(cancellationToken);
}
