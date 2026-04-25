using Pos.Application.DTOs;
using Pos.Application.Interfaces;
using Pos.Domain.Entities;

namespace Pos.Application.Services;

public interface IAppTransaction : IAsyncDisposable
{
    Task CommitAsync(CancellationToken cancellationToken = default);
}

public interface ITransactionProvider
{
    Task<IAppTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}

public class OrderService(
    IOrderRepository orderRepository,
    IProductRepository productRepository,
    IUnitOfWork unitOfWork,
    ITransactionProvider transactionProvider) : IOrderService
{
    public async Task<OrderResponseDto> CreateAsync(CreateOrderDto request, CancellationToken cancellationToken = default)
    {
        if (request.Items.Count == 0)
        {
            throw new InvalidOperationException("Order must contain at least one item.");
        }

        await using var tx = await transactionProvider.BeginTransactionAsync(cancellationToken);

        var order = new Order
        {
            OrderNo = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmssfff}",
            CustomerId = request.CustomerId
        };

        foreach (var item in request.Items)
        {
            var product = await productRepository.GetByIdAsync(item.ProductId, cancellationToken)
                          ?? throw new KeyNotFoundException($"Product '{item.ProductId}' not found.");

            if (!product.IsActive)
            {
                throw new InvalidOperationException($"Product '{product.Name}' is inactive.");
            }

            if (product.Stock < item.Quantity)
            {
                throw new InvalidOperationException($"Insufficient stock for '{product.Name}'.");
            }

            product.Stock -= item.Quantity;
            product.UpdatedAtUtc = DateTime.UtcNow;
            await productRepository.UpdateAsync(product, cancellationToken);

            var lineTotal = product.Price * item.Quantity;
            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                LineTotal = lineTotal
            });

            order.TotalAmount += lineTotal;
        }

        await orderRepository.AddAsync(order, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        await tx.CommitAsync(cancellationToken);

        return new OrderResponseDto(
            order.Id,
            order.OrderNo,
            order.CustomerId,
            order.TotalAmount,
            order.Items.Select(i =>
                new OrderItemResponseDto(i.ProductId, i.Product?.Name ?? string.Empty, i.Quantity, i.UnitPrice, i.LineTotal)).ToList());
    }

    public async Task<OrderResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await orderRepository.GetByIdAsync(id, cancellationToken);
        if (order is null) return null;

        return new OrderResponseDto(
            order.Id,
            order.OrderNo,
            order.CustomerId,
            order.TotalAmount,
            order.Items.Select(i => new OrderItemResponseDto(i.ProductId, i.Product?.Name ?? string.Empty, i.Quantity, i.UnitPrice, i.LineTotal)).ToList());
    }
}
