import Fastify from "fastify";
import { servicesRoutes } from "../src/routes/services.routes";

jest.mock("../src/utils/configLoader", () => ({
  loadConfig: jest.fn().mockReturnValue({
    interval: 10,
    services: [
      { name: "svc1", url: "http://localhost", expectedVersion: "1.0.0" },
    ],
  }),
  reloadConfig: jest.fn().mockReturnValue({
    interval: 10,
    services: [
      { name: "svc1", url: "http://localhost", expectedVersion: "1.0.0" },
      { name: "svc2", url: "http://localhost", expectedVersion: "1.0.0" },
    ],
  }),
}));

import { loadConfig, reloadConfig } from "../src/utils/configLoader";

describe("services.routes", () => {
  let app: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    app = Fastify();
    await app.register(servicesRoutes);
  });

  test("GET /services returns list of services", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/services",
    });

    expect(res.statusCode).toBe(200);
    expect(loadConfig).toHaveBeenCalled();

    expect(JSON.parse(res.body)).toEqual([
      { name: "svc1", url: "http://localhost", expectedVersion: "1.0.0" },
    ]);
  });

  test("POST /services/reload reloads config", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/services/reload",
    });

    expect(res.statusCode).toBe(200);
    expect(reloadConfig).toHaveBeenCalled();

    expect(JSON.parse(res.body)).toEqual({
      message: "Configuration reloaded",
      serviceCount: 2,
    });
  });
});
