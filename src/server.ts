import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { appRoutes } from "./routes";

dotenv.config();

const app = fastify();

app.register(cors, {
  origin: ["http://localhost:3000"],
});

app.register(appRoutes);

const port = process.env.PORT ?? 8081;
app.listen({ port: port as number }).then(() => {
  console.log("listening on port: " + port);
});
