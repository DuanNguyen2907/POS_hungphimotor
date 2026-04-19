# syntax=docker/dockerfile:1

# ==============================
# 1) Build stage
# ==============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file first for better layer caching
COPY src/Pos.Api/*.csproj ./Pos.Api/
COPY src/Pos.Application/*.csproj ./Pos.Application/
COPY src/Pos.Domain/*.csproj ./Pos.Domain/
COPY src/Pos.Infrastructure/*.csproj ./Pos.Infrastructure/
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

ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app/publish ./

USER appuser
EXPOSE 8080
ENTRYPOINT ["dotnet", "Pos.Api.dll"]
