// src/ectoGenerator.ts
import { PrismaModel } from "./parser";
import * as fs from "fs";

var schemaDir = "./output/schemas";

export function generateEctoSchema(models: PrismaModel[], outputPath: string) {
  if (!fs.existsSync(schemaDir)) {
    fs.mkdirSync(schemaDir, { recursive: true });
  }

  models.forEach((model) => {
    const schemaFileContent = `
defmodule MyApp.${model.name} do
  use Ecto.Schema
  import Ecto.Changeset

  schema "${model.name.toLowerCase()}" do
${model.fields
  .map((field) => `    field :${field.name}, :${convertPrismaType(field.type)}`)
  .join("\n")}

    timestamps()
  end

  def changeset(${model.name.toLowerCase()}, attrs) do
    ${model.name.toLowerCase()}
    |> cast(attrs, [${model.fields
      .map((field) => `:${field.name}`)
      .join(", ")}])
    |> validate_required([${model.fields
      .map((field) => `:${field.name}`)
      .join(", ")}])
  end
end
`;

    fs.writeFileSync(`${schemaDir}/${model.name.toLowerCase()}.ex`, schemaFileContent);
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
