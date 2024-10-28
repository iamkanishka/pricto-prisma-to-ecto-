#!/usr/bin/env node
"use strict";
// src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const ectoGenerator_1 = require("./ectoGenerator");
const migrationGenerator_1 = require("./migrationGenerator");
const prismaSchemaPath = process.argv[2];
const outputPath = process.argv[3];
if (!prismaSchemaPath || !outputPath) {
    console.error("Usage: pricto <prismaSchemaPath> <outputPath>");
    process.exit(1);
}
const models = (0, parser_1.parsePrismaSchema)(prismaSchemaPath);
(0, ectoGenerator_1.generateEctoSchema)(models, outputPath);
(0, migrationGenerator_1.generateMigrationFiles)(models, outputPath);
