# Service Reliability Monitor

## Overview

### Problem

- Who is affected?
  - Engineering, platform, and operations teams responsible for multiple internal services.
- What is the issue?
  - Service health, latency, availability, and version drift can be hard to track consistently across different microservices without a lightweight central monitor.

### Outcome

- What was achieved?
  - A Fastify and TypeScript monitoring service that periodically checks configured services, stores results in SQLite, and exposes a dashboard plus API endpoints for current and historical service status.
- Measurable results (if any).
  - Four Dockerized sample services are monitored every 10 seconds by default.
  - Automated Jest tests cover the scheduler, health checker, storage, routes, and YAML config loader.

---

## Demo

From the user's perspective:

1. Start the API and sample services with `make up`.
2. Open `http://localhost:8000` to view the service reliability dashboard.
3. Review the latest status, latency, version, and availability information for each configured service.
4. Query `GET /health` for the latest service results or `GET /health/:name` for service history.
5. Update `src/config/services.yaml`, then call `POST /services/reload` to reload configuration without restarting the API.

<img width="1892" height="926" alt="Service Reliability Monitor dashboard" src="https://github.com/user-attachments/assets/494f279f-4a3c-4e35-89a0-bbdfe66246dc" />

---

## Technology Stack

### Frontend components:

- Static HTML dashboard served from `src/dashboard.html`.
- Browser-based API polling for displaying service health information.

### Backend components:

- Node.js
- TypeScript
- Fastify
- `@fastify/static`
- SQLite through `better-sqlite3`
- YAML configuration through `js-yaml`
- `undici` for HTTP health checks
- Jest and ts-jest for automated tests
- Docker and Docker Compose for the API and sample services

---

## Installation

Prerequisites:

- Node.js
- npm
- Docker
- Docker Compose
- make

Steps:

```bash
npm install
make up
```

The API and dashboard run at `http://localhost:8000`.

To stop all containers:

```bash
make down
```

---

## Usage

Run the project locally with Docker:

```bash
make up
```

Run only the API container:

```bash
make api-up
```

Run only the sample test services:

```bash
make services-up
```

Run tests:

```bash
make tests
```

Useful endpoints:

- `GET /` - dashboard.
- `GET /health` - latest result for each monitored service.
- `GET /health/:name` - historical results for one service, such as `/health/user-service`.
- `GET /services` - currently loaded service configuration.
- `POST /services/reload` - reloads `src/config/services.yaml`.

Expected behaviour:

- The scheduler reads `src/config/services.yaml`.
- Every configured interval, it checks each service URL.
- Results are persisted to SQLite.
- Version mismatches are detected by comparing service responses with `expectedVersion`.
- The dashboard and API expose the latest monitoring state.

---

## Project Structure

- `src/index.ts` - Fastify server setup, static dashboard serving, route registration, and scheduler startup.
- `src/dashboard.html` - browser dashboard for monitoring results.
- `src/core/` - scheduler and service health-checking logic.
- `src/db/` - SQLite schema and persistence helpers.
- `src/routes/` - Fastify API routes for health and service configuration.
- `src/utils/` - YAML configuration loading and reload helpers.
- `src/config/services.yaml` - monitored service definitions and polling interval.
- `test-services/` - Dockerized sample services used for demos and tests.
- `tests/` - Jest test suite.
- `docker-compose.yml` - API container configuration.
- `docker-compose.test-services.yml` - sample service container configuration.
- `docs/ai-dev/` - AI development documentation.
- `Extra/` - AI chat session logs and notes.
