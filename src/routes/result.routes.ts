import { FastifyInstance } from "fastify";
import {
  deleteResult,
  getAllResults,
  registrationResult,
} from "../controllers/result.controller";

export async function resultRoutes(app: FastifyInstance) {
  app.post("/result", registrationResult);

  app.get("/results", getAllResults);

  app.delete("/result/:id", deleteResult);
}
