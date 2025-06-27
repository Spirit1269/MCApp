# syntax=docker/dockerfile:1

#################################
# 1) Build the .NET API
#################################
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy only the project file and restore dependencies
COPY src/api/api.csproj ./
RUN dotnet restore api.csproj

# copy the rest of the source and publish
COPY src/api/. ./
RUN dotnet publish api.csproj \
    -c Release \
    -o /app/publish

#################################
# 2) Runtime image
#################################
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# pull the published output from the build stage
COPY --from=build /app/publish ./

EXPOSE 80

# the DLL name should match your project assembly
ENTRYPOINT ["dotnet", "api.dll"]
# Note: Ensure that the 'api.dll' matches the name of your published assembly.