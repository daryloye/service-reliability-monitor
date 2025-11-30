import { request } from "undici";
import { ServiceConfig } from "../utils/configLoader";

export interface HealthResult {
  name: string;
  ok: boolean;
  statusCode: number | null;
  latency: number;
  version?: string;
  expectedVersion?: string;
  versionMismatch?: boolean;
  timestamp: string;
  error?: string;
}

export async function checkService(service: ServiceConfig): Promise<HealthResult> {
  const start = performance.now();

  try {
    const { statusCode, body, headers } = await request(service.url, {
      method: "GET",
      headersTimeout: 5000,
      bodyTimeout: 5000,
    });

    const latency = performance.now() - start;
    let version: string | undefined;

    // Try header-based version
    if (headers["x-service-version"]) {
      version = Array.isArray(headers["x-service-version"])
        ? headers["x-service-version"][0]
        : (headers["x-service-version"] as string);
    }

    // Try body-based version (if JSON)
    try {
      const json = await body.json() as any;
      if (json.version) {
        version = json.version;
      }
    } catch {
      // Body is not JSON or no version field — ignore silently
    }

    return {
      name: service.name,
      ok: statusCode >= 200 && statusCode < 300,
      statusCode,
      latency: Math.round(latency),
      version,
      expectedVersion: service.expectedVersion,
      versionMismatch: version ? version !== service.expectedVersion : undefined,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);

    return {
      name: service.name,
      ok: false,
      statusCode: null,
      latency,
      version: undefined,
      expectedVersion: service.expectedVersion,
      versionMismatch: undefined,
      timestamp: new Date().toISOString(),
      error: err?.message ?? "Unknown error",
    };
  }
}
