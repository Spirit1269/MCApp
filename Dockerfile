# syntax=docker/dockerfile:1

# Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-build
WORKDIR /src
COPY src/api/api.csproj ./
RUN dotnet restore ./api.csproj
COPY src/api/. ./
RUN dotnet publish ./api.csproj -c Release -o /src/out

# Build Node/Next.js frontend
FROM node:20 AS node-build
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published API
COPY --from=dotnet-build /src/out ./

# Copy built frontend assets (adapt these paths to your project)
COPY --from=base /lib ./lib
COPY --from=base /src/types ./types
COPY --from=base /node_modules ./node_modules
COPY --from=base /app/globals.css ./globals.css
COPY --from=base /app/layout.tsx ./layout.tsx
COPY --from=base /app/page.tsx ./page.tsx

ENV NODE_ENV=production

EXPOSE 80
EXPOSE 443

# If your entrypoint is .NET API:
ENTRYPOINT ["dotnet", "api.dll"]