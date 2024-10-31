#!/usr/bin/env node
// src/index.ts
import { parsePrismaSchema } from "./parser";
import { generateEctoSchema } from "./ectoGenerator";
import { generateMigrationFiles } from "./migrationGenerator";

const operationType = process.argv[2];
var prismaSchemaDirPath = process.argv[3]
  ? process.argv[3]
  : "./prisma/schema.prisma";
const schemaOutpuPathDir = "./prisma-to-ecto/schemas";
const migrationOutputPathDir = "./prisma-to-ecto/migrations";

if (operationType && operationType === "convert") {
  const models = parsePrismaSchema(prismaSchemaDirPath);

  generateEctoSchema(models, schemaOutpuPathDir);
  generateMigrationFiles(models, migrationOutputPathDir);
} else {
  console.error("Usage: prisma-to-ecto convert");
  process.exit(1);
}
