using System.ComponentModel.DataAnnotations;

namespace Pos.Application.DTOs;

public record ProductResponseDto(Guid Id, string Name, string Barcode, decimal Price, int Stock, bool IsActive);

public class CreateProductDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Barcode { get; set; } = string.Empty;

    [Range(0.01, 999999999)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
}

public class UpdateProductDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Barcode { get; set; } = string.Empty;

    [Range(0.01, 999999999)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    public bool IsActive { get; set; } = true;
}
