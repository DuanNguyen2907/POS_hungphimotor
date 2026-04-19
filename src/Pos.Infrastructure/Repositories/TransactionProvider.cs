using Microsoft.EntityFrameworkCore.Storage;
using Pos.Application.Services;
using Pos.Infrastructure.Data;

namespace Pos.Infrastructure.Repositories;

public class TransactionProvider(PosDbContext dbContext) : ITransactionProvider
{
    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
        => dbContext.Database.BeginTransactionAsync(cancellationToken);
}
