import { saveHealthResult } from "../db/storage";
import { loadConfig } from "../utils/configLoader";
import { checkService } from "./checker";

export function startScheduler() {
  const config = loadConfig();

  const intervalMs = config.interval * 1000;

  console.log(`Scheduler started — running every ${config.interval} seconds`);

  setInterval(async () => {
    console.log("\n⏱  Running health checks...");

    for (const service of config.services) {
      try {
        const result = await checkService(service);

        saveHealthResult(result);

        if (result.ok) {
          console.log(
            `✓ ${service.name} OK (${result.statusCode}) — ${result.latency}ms`
          );
        } else {
          console.log(
            `✗ ${service.name} FAILED — ${result.error ?? result.statusCode}`
          );
        }
      } catch (err: any) {
        console.error(`✗ Error checking ${service.name}:`, err.message);
      }
    }

    console.log("✔ Health check cycle completed.");
  }, intervalMs);
}
