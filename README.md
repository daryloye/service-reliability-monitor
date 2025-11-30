# Service Reliability Checker (Fastify + TypeScript)

A lightweight reliability monitoring service that periodically checks internal APIs and provides a clean Fastify API exposing service health, version data, and latency metrics. Designed for simplicity, reliability, and quick deployment.

---

## Features

- Written in TypeScript with Fastify
- Loads services from JSON or YAML config
- Periodic checks with latency measurement
- Version extraction and version drift detection
- Persistent storage using SQLite (via Prisma or better-sqlite3)
- REST API to retrieve latest health status
- Optional HTML dashboard
- Docker-ready

---

## File Structure

service-reliability-monitor/
│
├── src/
│   ├── index.ts                # Fastify entrypoint
│   │
│   ├── api/
│   │   ├── health.routes.ts    # /health endpoints
│   │   └── services.routes.ts  # /services endpoints
│   │
│   ├── core/
│   │   ├── checker.ts          # HTTP ping, latency, version extraction
│   │   ├── scheduler.ts        # Periodic health checks
│   │   └── version.ts          # Version parsing helpers
│   │
│   ├── utils/
│   │   ├── logger.ts           # Pino logger configuration
│   │   └── configLoader.ts     # Load YAML/JSON service config
│   │
│   ├── config/
│   │   └── services.yaml       # List of services to monitor
│   │
│   ├── db/
│   │   ├── storage.ts          # SQLite helper functions
│   │   └── schema.sql          # Table creation if using raw SQL
│   │
│   └── ui/
│       └── index.html          # Optional dashboard
│
├── tests/
│   ├── checker.test.ts
│   ├── healthApi.test.ts
│   └── storage.test.ts
│
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml          # Optional
└── README.md
