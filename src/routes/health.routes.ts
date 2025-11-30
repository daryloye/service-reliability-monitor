import { FastifyInstance } from "fastify";
import { getHistory, getLatestResults } from "../db/storage";

export async function healthRoutes(app: FastifyInstance) {

  // GET /health → latest status for all services
  app.get("/health", async () => {
    return getLatestResults();
  });

  // GET /health/:name → history for a specific service
  app.get("/health/:name", async (req, reply) => {
    const { name } = req.params as { name: string };

    const rows = getHistory(name);

    if (rows.length === 0) {
      return reply.status(404).send({
        error: "Service not found or no history",
      });
    }

    return rows;
  });
}
