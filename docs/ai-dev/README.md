## AI Tools

- ChatGPT
  - Purpose: used throughout the build to help design, implement, test, review, and document the service reliability monitor.
- Codex
  - Purpose: used as an AI coding assistant for repository inspection, implementation review, documentation updates, and consistency checks against the codebase.

AI agents:

- Architecture agent
  - Role: shaped the project into small, testable components for configuration loading, health checking, storage, scheduling, API routes, and dashboard display.
  - Skills: TypeScript project structure, Fastify service design, local persistence design, and Docker-based development workflows.
- Implementation agent
  - Role: helped generate and refine the core application code across the backend, dashboard, sample services, and tests.
  - Skills: Fastify routes, YAML parsing, HTTP checks, SQLite persistence, Jest tests, Dockerfiles, and Docker Compose.
- Review agent
  - Role: checked generated code and project decisions for correctness, maintainability, and alignment with the intended monitoring workflow.
  - Skills: test review, endpoint review, configuration review, and documentation consistency.

---

## Development Approach with AI

Key prompts used:

- "Set up a TypeScript Fastify project for a lightweight service reliability monitor."
- "Create a YAML configuration loader for monitored services and add tests for valid and invalid config."
- "Add Dockerized sample services that expose health, status, or version endpoints for local testing."
- "Implement a health checker that records status code, latency, availability, version, and version drift."
- "Persist health check results in SQLite and add tests for inserting and reading service history."
- "Add a scheduler that periodically checks every configured service."
- "Expose API routes for latest health results, service history, current service configuration, and config reload."
- "Build a simple dashboard frontend that shows the current reliability state from the API."
- "Review the project structure, test coverage, API behavior, Docker workflow, and user-facing demo path for consistency."

Key review points and decisions:

- Initial project setup
  - Decision: use TypeScript with Fastify because the service needs a small typed API surface and straightforward local development.
- Configuration
  - Decision: store service definitions in `src/config/services.yaml` so monitored URLs, expected versions, environments, and intervals are easy to change.
- Test services
  - Decision: add Dockerized `user`, `auth`, `billing`, and `notifications` services so health checks can be demonstrated and tested repeatably.
- Health checking
  - Decision: capture availability, status code, latency, returned version, expected version, and version drift instead of only reporting up/down.
- Persistence
  - Decision: use SQLite through `better-sqlite3` because the project needs durable history without requiring a separate database server.
- Scheduler and API routes
  - Decision: use a simple interval scheduler and expose focused endpoints: latest health, per-service history, service config, and config reload.
- Dashboard
  - Decision: serve a static HTML dashboard from the Fastify app so the project has a visible demo without adding a separate frontend build system.
- Testing
  - Decision: add Jest tests across config loading, checker behavior, storage, scheduler, and routes to catch regressions in the core monitoring workflow.

---

## Reflection

What worked:

- AI support accelerated the end-to-end build from project setup through config, sample services, checker logic, persistence, scheduling, routes, dashboard, tests, and documentation.
- Building in small commits made the project easier to validate: config first, then services, checker, storage, scheduler/routes, dashboard, and cleanup.
- The separation between `src/core`, `src/db`, `src/routes`, and `src/utils` made the generated code easier to test and review.
- Dockerized sample services made the monitor demonstrable without depending on external APIs.

What failed or needed adjustment:

- The project needed review passes to keep route descriptions, commands, configuration paths, and dashboard behavior aligned with the actual code.
- The simple scheduler is appropriate for this scope, but a production version would need stronger lifecycle handling, retry policy, alerting, and observability.

Changes made and rationale:

- The project evolved from a minimal TypeScript/Fastify scaffold into a full local monitoring workflow with test services, health checks, SQLite history, API routes, dashboard, Docker setup, and tests.
- AI-generated code and structure were reviewed incrementally through tests and commit-level cleanup.
- The final project record now presents AI as part of the whole development process: design, implementation, testing, review, and explanation.
