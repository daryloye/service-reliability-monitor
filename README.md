# Service Reliability Monitor (Fastify + TypeScript)

A lightweight Fastify-based monitoring service that periodically checks the health, latency, and version of internal services, stores results in SQLite, and exposes the latest information through a clean API.

<br>

<img width="1892" height="926" alt="image" src="https://github.com/user-attachments/assets/494f279f-4a3c-4e35-89a0-bbdfe66246dc" />

<br>

## Features

### Periodic health checks
- Runs every N seconds (configurable in `services.yaml`).
- Measures latency, status code, version, and availability.
- Detects version drift.

### Persistent storage
- Uses SQLite via `better-sqlite3`.
- Stores historical records for analysis.

### API
- `GET /health` – latest results per service  
- `GET /health/:name` – historical results  
- `GET /services` – current configuration  
- `POST /services/reload` – hot reloads YAML config without restarting

### Dockerized test microservices
Simulated `user`, `auth`, `billing`, and `notifications` services for reproducible test runs.

<br>

## Quickstart

### Start API and test services
```bash
make up
```

### Stop all services
```bash
make down
```

### Run tests
```bash
make tests
```

### Configuration
Edit `src/config/services.yaml`

<br>

## Key Design Decisions

### Fastify with TypeScript
Chosen for a modern, high-performance foundation with strong type safety and minimal overhead.  
Fastify provides fast routing, schema-driven validation, clean plugins, and excellent TypeScript integration, making the service predictable and easy to maintain.

### SQLite Persistence
Selected for zero operational burden.  
SQLite offers file-based portability, instant startup, and reliable performance when paired with a sync driver like better-sqlite3, making it ideal for lightweight services without external DB dependencies.

### YAML-Based Configuration
Configuration is stored in YAML so non-developers can easily update runtime settings such as service URLs, expected versions, environment tags, and refresh intervals. This keeps the system accessible without requiring code changes.

### Simple Scheduler (setInterval)
A minimal scheduler using setInterval keeps the design lightweight and avoids the overhead of cron libraries. It’s sufficient for periodic polling without introducing extra dependencies or complexity.

### Dockerized Test Microservices
Test targets are containerized to ensure deterministic behavior.  
This setup provides realistic service interactions, predictable environments, and the ability to simulate version drift, latency conditions, and failure scenarios during automated testing.

<br>

## AI Usage Disclosure
AI assistance (ChatGPT) was used for:
- generating boilerplate Fastify + TypeScript scaffolding
- designing testable architecture
- drafting parts of this README

All logic was manually reviewed and tested.
