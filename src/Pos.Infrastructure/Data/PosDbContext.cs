using Microsoft.EntityFrameworkCore;
using Pos.Domain.Entities;

namespace Pos.Infrastructure.Data;

public class PosDbContext(DbContextOptions<PosDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.HasIndex(x => x.Barcode).IsUnique();
            entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Barcode).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Price).HasColumnType("numeric(18,2)");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.FullName).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Phone).HasMaxLength(30);
            entity.Property(x => x.Email).HasMaxLength(255);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.HasIndex(x => x.OrderNo).IsUnique();
            entity.Property(x => x.OrderNo).HasMaxLength(32).IsRequired();
            entity.Property(x => x.TotalAmount).HasColumnType("numeric(18,2)");
            entity.HasMany(x => x.Items)
                .WithOne(x => x.Order)
                .HasForeignKey(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.UnitPrice).HasColumnType("numeric(18,2)");
            entity.Property(x => x.LineTotal).HasColumnType("numeric(18,2)");
            entity.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
