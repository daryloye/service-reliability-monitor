import Fastify from "fastify";

const app = Fastify();

app.get("/status", async () => {
  await new Promise(r => setTimeout(r, 1500)); // simulate slowness
  return { version: "3.0.1" };
});

app.listen({ port: 3004, host: "0.0.0.0" }, () =>
  console.log("Notifications-service :3004")
);
