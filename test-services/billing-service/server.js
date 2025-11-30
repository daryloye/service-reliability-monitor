import Fastify from "fastify";

const app = Fastify();

app.get("/version", async () => {
  throw new Error("Service unavailable");
});

app.listen({ port: 3003, host: "0.0.0.0" }, () =>
  console.log("Billing-service :3003")
);
