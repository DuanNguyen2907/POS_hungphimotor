using System.ComponentModel.DataAnnotations;

namespace Pos.Application.DTOs;

public record CustomerResponseDto(Guid Id, string FullName, string? Phone, string? Email);

public class CreateCustomerDto
{
    [Required, MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Phone, MaxLength(30)]
    public string? Phone { get; set; }

    [EmailAddress, MaxLength(255)]
    public string? Email { get; set; }
}

public class UpdateCustomerDto : CreateCustomerDto;
