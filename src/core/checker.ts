import { request } from "undici";
import { ServiceConfig } from "../utils/configLoader";

export interface HealthResult {
  name: string;
  ok: boolean;
  statusCode: number | null;
  latency: number;
  version: string | null;
  expectedVersion: string;
  versionMismatch: boolean;
  timestamp: string;
  error: string | null;
}

export async function checkService(service: ServiceConfig): Promise<HealthResult> {
  const start = performance.now();

  try {
    const { statusCode, body, headers } = await request(service.url, {
      method: "GET",
      headersTimeout: 5000,
      bodyTimeout: 5000,
    });

    const latency = Math.round(performance.now() - start);

    let version: string | null = null;

    // Header-based version
    const headerVersion = headers["x-service-version"];
    if (headerVersion) {
      version = Array.isArray(headerVersion)
        ? headerVersion[0]
        : headerVersion;
    }

    // Body-based version
    try {
      const json = await body.json() as any;
      if (json?.version) {
        version = json.version;
      }
    } catch {
      // Body is not JSON or no version field — ignore
    }

    const versionMismatch = version !== null && version !== service.expectedVersion;

    return {
      name: service.name,
      ok: statusCode >= 200 && statusCode < 300,
      statusCode,
      latency,
      version,
      expectedVersion: service.expectedVersion,
      versionMismatch,
      timestamp: new Date().toISOString(),
      error: null,
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);

    return {
      name: service.name,
      ok: false,
      statusCode: null,
      latency,
      version: null,
      expectedVersion: service.expectedVersion,
      versionMismatch: false,
      timestamp: new Date().toISOString(),
      error: err?.message ?? "Unknown error",
    };
  }
}
