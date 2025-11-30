import fs from "fs";
import yaml from "js-yaml";
import path from "path";

export interface ServiceConfig {
  name: string;
  url: string;
  expectedVersion: string;
  environment?: string;
}

export interface AppConfig {
  interval: number;
  services: ServiceConfig[];
}

const CONFIG_PATH = path.join(process.cwd(), "src/config/services.yaml");

let cachedConfig: AppConfig | null = null;

function parseConfig(): AppConfig {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Config file not found at: ${CONFIG_PATH}`);
  }

  const fileContents = fs.readFileSync(CONFIG_PATH, "utf8");
  const parsed = yaml.load(fileContents) as AppConfig;

  if (!parsed || !Array.isArray(parsed.services)) {
    throw new Error("Invalid config format. Expected { services: [...] }");
  }

  if (typeof parsed.interval !== "number") {
    throw new Error("Missing or invalid 'interval' in root config.");
  }

  // Validate each service entry
  parsed.services.forEach((svc, i) => {
    if (!svc.name) {
      throw new Error(`Missing 'name' in services[${i}]`);
    }
    if (!svc.url) {
      throw new Error(`Missing 'url' in services[${i}] (${svc.name})`);
    }
    if (!svc.expectedVersion) {
      throw new Error(
        `Missing 'expectedVersion' in services[${i}] (${svc.name})`
      );
    }
  });

  return parsed;
}

export function loadConfig(): AppConfig {
  if (!cachedConfig) {
    cachedConfig = parseConfig();
  }
  return cachedConfig;
}

export function reloadConfig(): AppConfig {
  cachedConfig = parseConfig();
  return cachedConfig;
}

export function resetCache() {
  cachedConfig = null;
}