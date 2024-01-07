import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";

export const swagger: FastifyDynamicSwaggerOptions = {
  swagger: {
    info: {
      title: "API Boletim Escolar",
      description: "Documentação da API Boletim Escolar",
      version: "1.0.0",
      contact: {
        name: "Thalis Zambarda",
        url: "https://thaliszambarda.vercel.app/",
        email: "thaliszambarda@gmail.com",
      },
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "resultado", description: "Endpoints para gerenciar resultados" },
    ],
    definitions: {
      Resultado: {
        type: "object",
        required: ["id", "bimestre", "disciplina", "nota"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "ID único do resultado",
          },
          bimestre: { type: "string", description: "Bimestre da disciplina" },
          disciplina: { type: "string", description: "Nome da disciplina" },
          nota: { type: "number", description: "Nota obtida na disciplina" },
          criadoEm: {
            type: "date",
            description: "Data de criação do registro",
          },
          atualizadoEm: {
            type: "date",
            description: "Data da última atualização do registro",
          },
        },
      },
    },
    paths: {
      "/api/v1/result": {
        post: {
          tags: ["resultado"],
          summary: "Cria um novo registro com uma nota e bimestre únicos",
          description: "Cria um novo registro com uma nota e bimestre únicos",
          parameters: [
            {
              name: "Resultado",
              in: "body",
              description: "Objeto contendo dados do novo registro",
              required: true,
              schema: {
                $ref: "#/definitions/Resultado",
              },
            },
          ],
          responses: {
            "201": {
              description: "Criado",
            },
            "400": {
              description: "Requisição Inválida - Dados de entrada inválidos",
            },
            "406": {
              description: "Não Aceitável - Tipo de mídia não suportado",
            },
            "500": {
              description: "Erro Interno do Servidor",
            },
          },
        },
      },
      "/api/v1/results": {
        get: {
          tags: ["resultado"],
          description: "Recupera todos os registros do Banco de Dados",
          summary: "Recupera todos os registros cadastrados",
          responses: {
            "200": {
              description: "OK - Sucesso na recuperação",
            },
            "500": {
              description: "Erro Interno do Servidor - Falha na recuperação",
            },
          },
        },
      },
      "/api/v1/result/{id}": {
        delete: {
          tags: ["resultado"],
          summary: "Exclui um registro de um bimestre específico",
          description:
            "Exclui um registro relacionado a uma disciplina e um bimestre",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "ID do registro a ser excluído",
              required: true,
              type: "string",
            },
          ],
          responses: {
            "200": {
              description: "OK - Registro excluído com sucesso",
            },
            "404": {
              description: "Não Encontrado - Registro não encontrado",
            },
            "500": {
              description: "Erro Interno do Servidor - Falha na exclusão",
            },
          },
        },
      },
    },
  },
};

export const docs: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
};
