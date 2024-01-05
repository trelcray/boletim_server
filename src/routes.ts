import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export async function appRoutes(app: FastifyInstance) {
  app.post("/result", async (request) => {
    const BimestreEnum = z.enum(["PRIMEIRO", "SEGUNDO", "TERCEIRO", "QUARTO"], {
      errorMap: () => ({ message: "Informe um bimestre válido." }),
    });
    const DisciplinaEnum = z.enum(
      ["Biologia", "Artes", "Geografia", "Sociologia"],
      { errorMap: () => ({ message: "Informe uma disciplina válida." }) },
    );
    const createResultBody = z.object({
      bimestre: BimestreEnum,
      disciplina: DisciplinaEnum,
      nota: z
        .number({ invalid_type_error: "Apenas numeros!" })
        .min(0, { message: "Nota não pode ser menor que 0." })
        .max(10, { message: "Nota não pode ser maior que 10." }),
    });

    try {
      const { bimestre, disciplina, nota } = createResultBody.parse(
        request.body,
      );

      // Verificar se já existe um resultado para a combinação de bimestre e disciplina
      const existingResult = await prisma.resultado.findFirst({
        where: {
          bimestre,
          disciplina,
        },
      });

      if (existingResult) {
        return {
          status: "error",
          message:
            "Já existe um resultado para essa disciplina neste bimestre.",
        };
      }

      await prisma.resultado.create({
        data: {
          bimestre,
          disciplina,
          nota,
          criadoEm: new Date(),
        },
      });

      return {
        status: "success",
        message: "Resultado criado com sucesso.",
      };
    } catch (error: unknown) {
      if (error instanceof z.ZodError && error.errors.length > 0) {
        const errorMessage = error.errors[0].message;
        return {
          status: "error",
          message: errorMessage,
        };
      }

      throw new Error((error as Error).message);
    }
  });

  app.get("/results", async () => {
    try {
      const allResults = await prisma.resultado.findMany();
      return {
        status: "success",
        data: allResults,
      };
    } catch (error) {
      console.error("Erro na requisição:", (error as Error).message);
      return {
        status: "error",
        message: "Erro ao obter os resultados.",
      };
    }
  });

  app.delete("/result/:id", async (request) => {
    const resultIdParams = z.object({
      id: z.string().uuid("ID inválido!"),
    });

    try {
      const { id } = resultIdParams.parse(request.params);
      const existingResult = await prisma.resultado.findUnique({
        where: { id },
      });

      if (!existingResult) {
        return {
          status: "error",
          message: "Resultado não encontrado.",
        };
      }

      await prisma.resultado.delete({
        where: { id },
      });

      return {
        status: "success",
        message: "Resultado excluído com sucesso.",
      };
    } catch (error) {
      if (error instanceof z.ZodError && error.errors.length > 0) {
        const errorMessage = error.errors[0].message;
        return {
          status: "error",
          message: errorMessage,
        };
      }

      throw new Error((error as Error).message);
    }
  });
}
