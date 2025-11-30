import Fastify from "fastify";
import { startScheduler } from "./core/scheduler";
import { healthRoutes } from "./routes/health.routes";
import { servicesRoutes } from "./routes/services.routes";

async function buildServer() {
  const app = Fastify({ logger: true });

  // register routes
  app.register(healthRoutes);
  app.register(servicesRoutes);

  // start scheduler
  startScheduler();

  return app;
}

buildServer().then((app) => {
  app.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`API running at ${address}`);
  });
});
