"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMigrationFiles = void 0;
const fs = __importStar(require("fs"));
function generateMigrationFiles(models, outputPathDir) {
    if (!fs.existsSync(outputPathDir)) {
        fs.mkdirSync(outputPathDir, { recursive: true });
    }
    models.forEach((model) => {
        const migrationFileContent = `
defmodule MyApp.Repo.Migrations.Create${model.name} do
  use Ecto.Migration

  def change do
    create table(:${model.name.toLowerCase()}) do
${model.fields
            .map((field) => `      add :${field.name}, :${convertPrismaType(field.type)}${field.isUnique ? ", unique: true" : ""}${field.isId ? ", primary_key: true" : ""}`)
            .join("\n")}
      timestamps()
    end
  end
end
`;
        const timestamp = Date.now();
        fs.writeFileSync(`${outputPathDir}/create_${model.name.toLowerCase()}_${timestamp}.exs`, migrationFileContent);
    });
}
exports.generateMigrationFiles = generateMigrationFiles;
function convertPrismaType(prismaType) {
    switch (prismaType) {
        case "Int":
            return "integer";
        case "String":
            return "string";
        case "Boolean":
            return "boolean";
        case "DateTime":
            return "naive_datetime";
        default:
            return "string";
    }
}
