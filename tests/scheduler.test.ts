jest.mock("../src/core/checker", () => ({
  checkService: jest.fn().mockResolvedValue({
    name: "svc",
    ok: true,
    statusCode: 200,
    latency: 10,
    version: "1.0.0",
    expectedVersion: "1.0.0",
    versionMismatch: false,
    timestamp: new Date().toISOString(),
    error: null,
  }),
}));

jest.mock("../src/db/storage", () => ({
  saveHealthResult: jest.fn(),
}));

jest.mock("../src/utils/configLoader", () => ({
  loadConfig: () => ({
    interval: 1, // 1 second
    services: [
      {
        name: "svc",
        url: "http://localhost",
        expectedVersion: "1.0.0",
      },
    ],
  }),
}));

import { checkService } from "../src/core/checker";
import { startScheduler } from "../src/core/scheduler";
import { saveHealthResult } from "../src/db/storage";

describe("Scheduler", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  test("runs and triggers service checks", async () => {
    startScheduler();

    jest.advanceTimersByTime(1000);

    // allow async interval callback to flush
    await Promise.resolve();

    expect(checkService).toHaveBeenCalled();
    expect(saveHealthResult).toHaveBeenCalled();
  });
});
