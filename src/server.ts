import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { docs, swagger } from "./config/docs";
import { resultRoutes } from "./routes/result.routes";

dotenv.config();

const app = fastify();

app.register(cors, {
  origin: ["*"],
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
});

app.register(resultRoutes, { prefix: "/api/v1" });

app.get("/", (request, reply) => {
  /* #swagger.ignore=true*/ reply.redirect("/docs");
});

app.register(fastifySwagger, swagger);
app.register(fastifySwaggerUi, docs);

const port = process.env.PORT ?? "8081";

const { ADDRESS = "localhost", PORT = port } = process.env;

app.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
