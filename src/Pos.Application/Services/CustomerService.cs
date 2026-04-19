using Pos.Application.DTOs;
using Pos.Application.Interfaces;
using Pos.Domain.Entities;

namespace Pos.Application.Services;

public class CustomerService(ICustomerRepository customerRepository, IUnitOfWork unitOfWork) : ICustomerService
{
    public async Task<IReadOnlyList<CustomerResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var customers = await customerRepository.GetAllAsync(cancellationToken);
        return customers.Select(Map).ToList();
    }

    public async Task<CustomerResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await customerRepository.GetByIdAsync(id, cancellationToken);
        return customer is null ? null : Map(customer);
    }

    public async Task<CustomerResponseDto> CreateAsync(CreateCustomerDto request, CancellationToken cancellationToken = default)
    {
        var customer = new Customer
        {
            FullName = request.FullName.Trim(),
            Phone = request.Phone?.Trim(),
            Email = request.Email?.Trim()
        };

        await customerRepository.AddAsync(customer, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(customer);
    }

    public async Task<CustomerResponseDto?> UpdateAsync(Guid id, UpdateCustomerDto request, CancellationToken cancellationToken = default)
    {
        var customer = await customerRepository.GetByIdAsync(id, cancellationToken);
        if (customer is null) return null;

        customer.FullName = request.FullName.Trim();
        customer.Phone = request.Phone?.Trim();
        customer.Email = request.Email?.Trim();
        customer.UpdatedAtUtc = DateTime.UtcNow;

        await customerRepository.UpdateAsync(customer, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(customer);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await customerRepository.GetByIdAsync(id, cancellationToken);
        if (customer is null) return false;

        await customerRepository.DeleteAsync(customer, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static CustomerResponseDto Map(Customer customer)
        => new(customer.Id, customer.FullName, customer.Phone, customer.Email);
}
