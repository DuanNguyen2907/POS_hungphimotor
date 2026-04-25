# syntax=docker/dockerfile:1

# ==============================
# 1) Build stage
# ==============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files first for better layer caching
COPY src/Pos.Domain/Pos.Domain.csproj ./Pos.Domain/
COPY src/Pos.Application/Pos.Application.csproj ./Pos.Application/
COPY src/Pos.Infrastructure/Pos.Infrastructure.csproj ./Pos.Infrastructure/
COPY src/Pos.Api/Pos.Api.csproj ./Pos.Api/
RUN dotnet restore ./Pos.Api/Pos.Api.csproj

# Copy source and publish
COPY src/ ./
RUN dotnet publish ./Pos.Api/Pos.Api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# ==============================
# 2) Runtime stage
# ==============================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user
RUN useradd --create-home --uid 10001 appuser

# Runtime settings
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

# Copy only published output
COPY --from=build /app/publish ./

# Drop privileges
USER appuser

EXPOSE 8080
ENTRYPOINT ["dotnet", "Pos.Api.dll"]
