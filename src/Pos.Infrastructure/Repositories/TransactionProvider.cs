using Microsoft.EntityFrameworkCore.Storage;
using Pos.Application.Services;
using Pos.Infrastructure.Data;

namespace Pos.Infrastructure.Repositories;

public class TransactionProvider(PosDbContext dbContext) : ITransactionProvider
{
    public async Task<IAppTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        return new EfCoreAppTransaction(transaction);
    }

    private sealed class EfCoreAppTransaction(IDbContextTransaction innerTransaction) : IAppTransaction
    {
        public Task CommitAsync(CancellationToken cancellationToken = default)
            => innerTransaction.CommitAsync(cancellationToken);

        public ValueTask DisposeAsync()
            => innerTransaction.DisposeAsync();
    }
}
