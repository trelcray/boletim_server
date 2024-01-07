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
  origin: [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "https://trelcray-boletim.vercel.app/",
  ],
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
});

app.get("/", (request, reply) => {
  /* #swagger.ignore=true*/ reply.redirect("/docs");
});

app.register(resultRoutes, { prefix: "/api/v1" });

app.register(fastifySwagger, swagger);
app.register(fastifySwaggerUi, docs);

const port = process.env.PORT ?? 8081;

const startServer = async () => {
  try {
    await app.listen({ port: port as number });
    console.log("Listening on port: " + port);
  } catch (error) {
    app.log.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
