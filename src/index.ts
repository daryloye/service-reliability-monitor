import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/", async () => {
  return { status: "ok" };
});

app.listen({ port: 8080, host: "0.0.0.0" }).then(() => {
  console.log("Server running on http://localhost:8080");
});
