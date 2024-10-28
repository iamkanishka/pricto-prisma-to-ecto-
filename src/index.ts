// src/index.ts

import { parsePrismaSchema } from "./parser";
import { generateEctoSchema } from "./ectoGenerator";
import { generateMigrationFiles } from "./migrationGenerator";

const prismaSchemaPath = process.argv[2];
const outputPath = process.argv[3];

if (!prismaSchemaPath || !outputPath) {
  console.error("Usage: pricto <prismaSchemaPath> <outputPath>");
  process.exit(1);
}

const models = parsePrismaSchema(prismaSchemaPath);
generateEctoSchema(models, outputPath);
generateMigrationFiles(models, outputPath);
