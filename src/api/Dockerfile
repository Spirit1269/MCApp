# syntax=docker/dockerfile:1

# Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-build
WORKDIR /src
COPY src/api/api.csproj ./
RUN dotnet restore ./api.csproj
COPY src/api/. ./
RUN dotnet publish ./api.csproj -c Release -o /src/out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=dotnet-build /src/out .
EXPOSE 80
ENTRYPOINT ["dotnet", "api.dll"]