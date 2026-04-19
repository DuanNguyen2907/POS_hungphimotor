using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Pos.Api.Extensions;

public static class KeycloakAuthExtensions
{
    public static IServiceCollection AddKeycloakAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var keycloak = configuration.GetSection("Keycloak");
        var authority = keycloak["Authority"] ?? throw new InvalidOperationException("Keycloak:Authority is required.");
        var audience = keycloak["Audience"] ?? throw new InvalidOperationException("Keycloak:Audience is required.");
        var requireHttpsMetadata = keycloak.GetValue("RequireHttpsMetadata", true);

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = authority;
                options.Audience = audience;
                options.RequireHttpsMetadata = requireHttpsMetadata;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    RoleClaimType = ClaimTypes.Role,
                    NameClaimType = "preferred_username"
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        if (context.Principal?.Identity is not ClaimsIdentity identity)
                        {
                            return Task.CompletedTask;
                        }

                        AddRealmRoles(identity, context.Principal);
                        AddClientRoles(identity, context.Principal, audience);

                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            options.AddPolicy("StaffOrAdmin", policy => policy.RequireRole("Admin", "Staff"));
        });

        return services;
    }

    private static void AddRealmRoles(ClaimsIdentity identity, ClaimsPrincipal principal)
    {
        var realmAccessJson = principal.FindFirstValue("realm_access");
        if (string.IsNullOrWhiteSpace(realmAccessJson)) return;

        using var realmDoc = JsonDocument.Parse(realmAccessJson);
        if (!realmDoc.RootElement.TryGetProperty("roles", out var rolesElement) ||
            rolesElement.ValueKind != JsonValueKind.Array)
        {
            return;
        }

        foreach (var roleElement in rolesElement.EnumerateArray())
        {
            var role = roleElement.GetString();
            if (!string.IsNullOrWhiteSpace(role))
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }
        }
    }

    private static void AddClientRoles(ClaimsIdentity identity, ClaimsPrincipal principal, string audience)
    {
        var resourceAccessJson = principal.FindFirstValue("resource_access");
        if (string.IsNullOrWhiteSpace(resourceAccessJson)) return;

        using var resourceDoc = JsonDocument.Parse(resourceAccessJson);
        if (!resourceDoc.RootElement.TryGetProperty(audience, out var clientElement) ||
            !clientElement.TryGetProperty("roles", out var rolesElement) ||
            rolesElement.ValueKind != JsonValueKind.Array)
        {
            return;
        }

        foreach (var roleElement in rolesElement.EnumerateArray())
        {
            var role = roleElement.GetString();
            if (!string.IsNullOrWhiteSpace(role))
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }
        }
    }
}
