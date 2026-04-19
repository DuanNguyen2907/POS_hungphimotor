# syntax=docker/dockerfile:1

# ==============================
# 1) Build stage
# ==============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only project file first for better layer caching
COPY src/Api/*.csproj ./Api/
RUN dotnet restore ./Api/Api.csproj

# Copy source and publish
COPY src/ ./
RUN dotnet publish ./Api/Api.csproj \
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
ENTRYPOINT ["dotnet", "Api.dll"]
