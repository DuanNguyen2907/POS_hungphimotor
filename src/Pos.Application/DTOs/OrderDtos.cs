using System.ComponentModel.DataAnnotations;

namespace Pos.Application.DTOs;

public class CreateOrderDto
{
    public Guid? CustomerId { get; set; }

    [Required, MinLength(1)]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class CreateOrderItemDto
{
    [Required]
    public Guid ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}

public record OrderItemResponseDto(Guid ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal LineTotal);

public record OrderResponseDto(Guid Id, string OrderNo, Guid? CustomerId, decimal TotalAmount, IReadOnlyList<OrderItemResponseDto> Items);
