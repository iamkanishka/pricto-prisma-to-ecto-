// src/migrationGenerator.ts
import { PrismaModel } from "./parser";
import * as fs from "fs";
 

export function generateMigrationFiles(
  models: PrismaModel[],
  outputPathDir: string 
) {
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
  .map(
    (field) =>
      `      add :${field.name}, :${convertPrismaType(field.type)}${
        field.isUnique ? ", unique: true" : ""
      }`
  )
  .join("\n")}
      timestamps()
    end
  end
end
`;

    const timestamp = Date.now();
    fs.writeFileSync(
      `${outputPathDir}/create_${model.name.toLowerCase()}_${timestamp}.exs`,
      migrationFileContent
    );
  });
}

function convertPrismaType(prismaType: string): string {
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
