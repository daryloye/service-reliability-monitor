import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { HealthResult } from "../core/checker";

let db: Database.Database | null = null;

export function initDb(customPath?: string) {
  const DB_PATH =
    customPath ??
    path.join(process.cwd(), "service-monitor.db");

  const SCHEMA_PATH = path.join(process.cwd(), "src/db/schema.sql");

  db = new Database(DB_PATH);

  if (fs.existsSync(SCHEMA_PATH)) {
    const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
    db.exec(schema);
  }
}

function getDb() {
  if (!db) {
    if (process.env.NODE_ENV === "test") {
      initDb(":memory:");
    } else {
      initDb();
    }
  }
  return db!;
}

// Insert a health check result
export function saveHealthResult(result: HealthResult) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO checks
      (serviceName, statusCode, ok, latency, version, expectedVersion, versionMismatch, timestamp, error)
    VALUES
      (@serviceName, @statusCode, @ok, @latency, @version, @expectedVersion, @versionMismatch, @timestamp, @error)
  `);

  stmt.run({
    serviceName: result.name,
    statusCode: result.statusCode,
    ok: result.ok ? 1 : 0,
    latency: result.latency,
    version: result.version ?? null,
    expectedVersion: result.expectedVersion ?? null,
    versionMismatch: result.versionMismatch ? 1 : 0,
    timestamp: result.timestamp,
    error: result.error ?? null,
  });
}

// Get latest result for each service
export function getLatestResults(): any[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT *
    FROM checks
    WHERE id IN (
      SELECT MAX(id)
      FROM checks
      GROUP BY serviceName
    )
    ORDER BY serviceName;
  `);

  return stmt.all();
}

// Get full history for a single service
export function getHistory(serviceName: string): any[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT *
    FROM checks
    WHERE serviceName = ?
    ORDER BY timestamp DESC
    LIMIT 200;
  `);

  return stmt.all(serviceName);
}

export function clearStorage() {
  const db = getDb();
  db.exec("DELETE FROM checks;");
}
