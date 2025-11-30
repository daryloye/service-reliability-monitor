import { FastifyInstance } from "fastify";
import { loadConfig, reloadConfig } from "../utils/configLoader";

export async function servicesRoutes(app: FastifyInstance) {

  // GET /services → return the currently loaded service list
  app.get("/services", async () => {
    const config = loadConfig();
    return config.services;
  });

  // POST /services/reload → re-read services.yaml
  app.post("/services/reload", async () => {
    const newConfig = reloadConfig();
    return {
      message: "Configuration reloaded",
      serviceCount: newConfig.services.length,
    };
  });
}
