import Fastify from "fastify";

const app = Fastify();

app.get("/health", async () => {
  return {
    status: "ok",
    version: "2.0.0" // mismatch on purpose
  };
});

app.listen({ port: 3002, host: "0.0.0.0" }, () =>
  console.log("Auth-service running on :3002")
);
