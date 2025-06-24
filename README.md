# MCApp - Motorcycle Club App

MCApp is a full stack web application that combines a Next.js/TypeScript frontend with an ASP.NET Core API backend. The project is organized into separate directories for the frontend UI, backend services, and infrastructure.

## Directory overview

```
.
├── app/                # Top‑level Next.js pages
├── components/         # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Client-side utility modules
├── src/
│   ├── api/            # .NET Web API with EF Core
│   ├── db/             # Database migration scripts
│   └── types/          # Shared TypeScript interfaces
├── infra/              # Bicep template for Azure resources
├── scripts/            # Project setup scripts
├── compose.yaml        # Docker Compose for local dev
└── Dockerfile          # Builds the frontend
```

The README describes how to run both services using Docker Compose. The frontend is exposed on port `3000` and the API on port `8080`.

## Running with Docker

This repository includes Docker support for both the TypeScript/Next.js frontend and the C# .NET API backend. The setup uses Docker Compose to orchestrate both services.

### Requirements
- Docker and Docker Compose installed
- No external services (databases, caches) required by default

### Service versions
- **Frontend (ts-app):** Node.js 22.13.1 (slim)
- **Backend (dotnet-api):** .NET 8.0

### Ports
- **Frontend (ts-app):** http://localhost:3000
- **Backend (dotnet-api):** http://localhost:8080 (mapped to container port 80)

### Build and run
From the project root, run:

```sh
docker compose up --build
```

This will build and start both services:
- `ts-app` (Next.js frontend) on port 3000
- `dotnet-api` (.NET backend) on port 8080

### Environment variables
- No required environment variables are specified by default in the Dockerfiles or compose file.
- If you need to set environment variables, uncomment the `env_file` lines in `docker-compose.yml` and provide the appropriate `.env` files.

### Special configuration
- Both services run as non-root users inside their containers for improved security.
- The frontend service depends on the backend and will wait for it to be available.
- If you wish to enable HTTPS for the backend, uncomment the relevant port mapping in the compose file.

## Next steps for new contributors

1. **Run locally** – install Docker and start both services with `docker compose up --build` as described above.
2. **Explore the API** – review `src/api/Controllers/` and the EF Core models to understand available endpoints and authorization logic.
3. **Investigate the frontend** – look into `components/` and `app/` to see how React components consume the API.
4. **Check the deployment pipeline** – study the GitHub Actions workflow and `infra/` Bicep template if you plan to deploy to Azure or modify infrastructure.
5. **Learn more** – if unfamiliar with Next.js, EF Core, or Docker Compose, these technologies are central to development and deployment.

## Running tests

Execute the unit tests with:

```sh
npm test
```

---
