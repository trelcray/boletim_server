import fastify from "fastify";
import dotenv from "dotenv";

export const app = fastify();

dotenv.config();

app.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});
