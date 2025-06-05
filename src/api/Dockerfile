FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY ["src/api/*.csproj", "./"]
RUN dotnet restore

# Copy the rest of the source code
COPY ["src/api/.", "./"]
COPY ["src/api/models/.", "./Models/"]

# Build the application
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Expose port for the application
EXPOSE 80
EXPOSE 443

# Set the entry point
ENTRYPOINT ["dotnet", "api.dll"]