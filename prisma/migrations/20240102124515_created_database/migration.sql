-- CreateEnum
CREATE TYPE "Bimestre" AS ENUM ('PRIMEIRO', 'SEGUNDO', 'TERCEIRO', 'QUARTO');

-- CreateEnum
CREATE TYPE "Disciplina" AS ENUM ('Biologia', 'Artes', 'Geografia', 'Sociologia');

-- CreateTable
CREATE TABLE "Resultado" (
    "id" TEXT NOT NULL,
    "bimestre" "Bimestre" NOT NULL,
    "disciplina" "Disciplina" NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resultado_pkey" PRIMARY KEY ("id")
);
