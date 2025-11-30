import Fastify from "fastify";
import { healthRoutes } from "../src/routes/health.routes";

jest.mock("../src/db/storage", () => ({
  getLatestResults: jest.fn().mockReturnValue([
    { serviceName: "user-service", ok: 1, version: "1.0.0" },
  ]),
  getHistory: jest.fn().mockReturnValue([
    { serviceName: "user-service", ok: 1, version: "1.0.0" },
    { serviceName: "user-service", ok: 0, version: "1.0.0" },
  ]),
}));

import { getHistory, getLatestResults } from "../src/db/storage";

describe("health.routes", () => {
  let app: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    app = Fastify();
    await app.register(healthRoutes);
  });

  test("GET /health returns latest results", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(res.statusCode).toBe(200);
    expect(getLatestResults).toHaveBeenCalled();
    expect(JSON.parse(res.body)).toEqual([
      { serviceName: "user-service", ok: 1, version: "1.0.0" },
    ]);
  });

  test("GET /health/:name returns history for a service", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/health/user-service",
    });

    expect(res.statusCode).toBe(200);
    expect(getHistory).toHaveBeenCalledWith("user-service");

    expect(JSON.parse(res.body).length).toBe(2);
  });
});
