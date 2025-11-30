import { request } from "undici";
import { checkService } from "../src/core/checker";
import { ServiceConfig } from "../src/utils/configLoader";

jest.mock("undici", () => ({
  request: jest.fn(),
}));

describe("checkService", () => {
  const mockRequest = request as jest.Mock;

  const baseService: ServiceConfig = {
    name: "test-service",
    url: "http://localhost:9999/health",
    expectedVersion: "1.0.0",
    environment: "test",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns healthy result with matching version", async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      headers: {},
      body: {
        json: async () => ({ version: "1.0.0" }),
      },
    });

    const result = await checkService(baseService);

    expect(result.ok).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.version).toBe("1.0.0");
    expect(result.versionMismatch).toBe(false);
    expect(typeof result.latency).toBe("number");
  });

  test("detects version mismatch", async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      headers: {},
      body: {
        json: async () => ({ version: "2.0.0" }),
      },
    });

    const result = await checkService(baseService);

    expect(result.ok).toBe(true);
    expect(result.versionMismatch).toBe(true);
    expect(result.version).toBe("2.0.0");
  });

  test("handles JSON-less responses gracefully", async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      headers: {},
      body: {
        json: async () => {
          throw new Error("not JSON");
        },
      },
    });

    const result = await checkService(baseService);

    expect(result.ok).toBe(true);
    expect(result.version).toBeUndefined();
  });

  test("marks service as down when status code is not 2xx", async () => {
    mockRequest.mockResolvedValue({
      statusCode: 500,
      headers: {},
      body: {
        json: async () => ({ error: "failure" }),
      },
    });

    const result = await checkService(baseService);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(500);
  });

  test("handles network errors cleanly", async () => {
    mockRequest.mockRejectedValue(new Error("Network fail"));

    const result = await checkService(baseService);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBeNull();
    expect(result.error).toBe("Network fail");
  });
});
