import Fastify from "fastify";

const app = Fastify();

app.get("/health", async () => {
  return {
    status: "ok",
    version: "1.4.2"
  };
});

app.listen({ port: 3001, host: "0.0.0.0" }, () =>
  console.log("User-service running on :3001")
);
