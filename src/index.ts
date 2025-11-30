import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import path from "path";
import { startScheduler } from "./core/scheduler";
import { healthRoutes } from "./routes/health.routes";
import { servicesRoutes } from "./routes/services.routes";

async function buildServer() {
  const app = Fastify({ logger: true });

  app.register(fastifyStatic, {
    root: path.join(__dirname),
    prefix: "/",
  });

  app.get("/", async (req, reply) => {
    return reply.sendFile("dashboard.html");
  });

  app.register(healthRoutes);
  app.register(servicesRoutes);

  startScheduler();

  return app;
}

buildServer().then((app) => {
  app.listen({ port: 8000, host: "0.0.0.0" }, (err, address) => {
    if (err) throw err;
    console.log(`API running at ${address}`);
  });
});
