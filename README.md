motorcycleclub

## Running with Docker

This project includes Docker support for both the TypeScript/Next.js frontend and the C# .NET API backend. The setup uses Docker Compose to orchestrate both services.

### Requirements
- Docker and Docker Compose installed
- No external services (databases, caches) required by default

### Service Versions
- **Frontend (ts-app):** Node.js 22.13.1 (slim)
- **Backend (dotnet-api):** .NET 8.0

### Ports
- **Frontend (ts-app):** http://localhost:3000
- **Backend (dotnet-api):** http://localhost:8080 (mapped to container port 80)

### Build and Run
From the project root, run:

```sh
docker compose up --build
```

This will build and start both services:
- `ts-app` (Next.js frontend) on port 3000
- `dotnet-api` (.NET backend) on port 8080

### Environment Variables
- No required environment variables are specified by default in the Dockerfiles or compose file.
- If you need to set environment variables, uncomment the `env_file` lines in `docker-compose.yml` and provide the appropriate `.env` files.

### Special Configuration
- Both services run as non-root users inside their containers for improved security.
- The frontend service depends on the backend and will wait for it to be available.
- If you wish to enable HTTPS for the backend, uncomment the relevant port mapping in the compose file.

---
