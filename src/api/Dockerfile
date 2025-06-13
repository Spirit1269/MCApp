# syntax=docker/dockerfile:1

ARG DOTNET_VERSION=8.0

FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS build
WORKDIR /app

# Copy csproj and restore as distinct layers for better caching
COPY --link src/api/api.csproj ./
RUN --mount=type=cache,target=/root/.nuget/packages \
    --mount=type=cache,target=/root/.cache/msbuild \
    dotnet restore

# Copy the rest of the source code
COPY --link . .

# Publish the application
RUN dotnet publish src/api/api.csproj -c Release -o /app/out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION}
WORKDIR /app

# Base stage
FROM node:20 as base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build  # Ensure this step generates the required files

# Final stage
FROM node:20 as final
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/globals.css ./globals.css
COPY --from=base /app/layout.tsx ./layout.tsx
COPY --from=base /app/page.tsx ./page.tsx
COPY --from=base /app/next.config.js ./next.config.js

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY --from=build /app/out .

EXPOSE 80
EXPOSE 443

USER appuser

ENTRYPOINT ["dotnet", "api.dll"]
