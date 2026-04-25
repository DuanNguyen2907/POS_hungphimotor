# syntax=docker/dockerfile:1

# ==============================
# 1) Build stage
# ==============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy source and publish
COPY src/ ./src/
RUN if [ -f ./src/Pos.Api/Pos.Api.csproj ]; then \
      dotnet restore ./src/Pos.Api/Pos.Api.csproj && \
      dotnet publish ./src/Pos.Api/Pos.Api.csproj -c Release -o /app/publish /p:UseAppHost=false; \
    elif [ -f ./src/Api/Api.csproj ]; then \
      dotnet restore ./src/Api/Api.csproj && \
      dotnet publish ./src/Api/Api.csproj -c Release -o /app/publish /p:UseAppHost=false; \
    else \
      echo "Cannot find API project file. Expected ./src/Pos.Api/Pos.Api.csproj or ./src/Api/Api.csproj." && exit 1; \
    fi

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
ENTRYPOINT ["sh", "-c", "if [ -f Pos.Api.dll ]; then dotnet Pos.Api.dll; elif [ -f Api.dll ]; then dotnet Api.dll; else echo 'No API dll found in /app' && exit 1; fi"]
