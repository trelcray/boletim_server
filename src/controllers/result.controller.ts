import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export const registrationResult = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
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
    const { bimestre, disciplina, nota } = createResultBody.parse(request.body);

    // Verificar se já existe um resultado para a combinação de bimestre e disciplina
    const existingResult = await prisma.resultado.findFirst({
      where: {
        bimestre,
        disciplina,
      },
    });

    if (existingResult) {
      return reply.code(400).send({
        status: "error",
        message: "Já existe um resultado para essa disciplina neste bimestre.",
        details: "Por favor, forneça dados diferentes para evitar duplicatas.",
      });
    }

    await prisma.resultado.create({
      data: {
        bimestre,
        disciplina,
        nota,
        criadoEm: new Date(),
      },
    });

    return reply.code(201).send({
      status: "success",
      message: "Resultado criado com sucesso.",
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError && error.errors.length > 0) {
      const errorMessage = error.errors[0].message;
      return reply.code(400).send({
        message: errorMessage,
      });
    }
    console.error("Erro na requisição:", (error as Error).message);
    return reply.code(500).send({
      message: "Erro interno do servidor.",
    });
  }
};

export const getAllResults = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const allResults = await prisma.resultado.findMany();

    return reply.code(200).send({
      status: "success",
      data: allResults,
    });
  } catch (error) {
    console.error("Erro na requisição:", (error as Error).message);
    return reply.code(500).send({
      message: "Erro interno do servidor",
    });
  }
};

export const deleteResult = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const resultIdParams = z.object({
    id: z.string().uuid("ID inválido!"),
  });

  try {
    const { id } = resultIdParams.parse(request.params);

    const existingResult = await prisma.resultado.findUnique({
      where: { id },
    });

    if (!existingResult) {
      return reply.code(404).send({
        status: "error",
        message: "O resultado com o ID fornecido não foi encontrado. ",
        details: "Certifique-se de que o ID está correto e tente novamente.",
      });
    }

    await prisma.resultado.delete({
      where: { id },
    });

    return reply.code(200).send({
      status: "success",
      message: "Resultado excluído com sucesso.",
    });
  } catch (error) {
    if (error instanceof z.ZodError && error.errors.length > 0) {
      const errorMessage = error.errors[0].message;

      return reply.code(400).send({
        status: "error",
        message: errorMessage,
      });
    }

    console.error("Erro na requisição:", (error as Error).message);

    return reply.code(500).send({
      status: "error",
      message: "Erro interno do servidor.",
    });
  }
};
