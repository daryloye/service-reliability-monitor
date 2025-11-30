CREATE TABLE IF NOT EXISTS checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serviceName TEXT NOT NULL,
    statusCode INTEGER,
    ok INTEGER NOT NULL,
    latency INTEGER NOT NULL,
    version TEXT,
    expectedVersion TEXT,
    versionMismatch INTEGER,
    timestamp TEXT NOT NULL,
    error TEXT
);