process.env.NODE_ENV = "test";

import {
  clearStorage,
  getHistory,
  getLatestResults,
  saveHealthResult
} from "../src/db/storage";

describe("SQLite storage integration", () => {

  beforeEach(() => {
    clearStorage();
  });

  const record = {
    name: "user-service",
    ok: true,
    statusCode: 200,
    latency: 100,
    version: "1.0.0",
    expectedVersion: "1.0.0",
    versionMismatch: false,
    timestamp: new Date().toISOString(),
    error: null,
  };

  test("saves records", () => {
    expect(() => saveHealthResult(record)).not.toThrow();
  });

  test("reads latest results", () => {
    saveHealthResult(record);
    const results = getLatestResults();
    expect(results.length).toBe(1);
  });

  test("reads history", () => {
    saveHealthResult(record);
    saveHealthResult(record);
    const rows = getHistory("user-service");
    expect(rows.length).toBe(2);
  });
});
