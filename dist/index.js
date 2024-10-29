#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const parser_1 = require("./parser");
const ectoGenerator_1 = require("./ectoGenerator");
const migrationGenerator_1 = require("./migrationGenerator");
const operationType = process.argv[2];
var prismaSchemaDirPath = process.argv[3]
    ? process.argv[3]
    : "./prisma/schema.prisma";
const schemaOutpuPathDir = "./prisma-to-ecto/schemas";
const migrationOutputPathDir = "./prisma-to-ecto/migrations";
if (operationType && operationType === "convert") {
    const models = (0, parser_1.parsePrismaSchema)(prismaSchemaDirPath);
    (0, ectoGenerator_1.generateEctoSchema)(models, schemaOutpuPathDir);
    (0, migrationGenerator_1.generateMigrationFiles)(models, migrationOutputPathDir);
}
else {
    console.error("Usage: prisma-to-ecto convert");
    process.exit(1);
}
