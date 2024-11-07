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
exports.generateEctoSchema = void 0;
const fs = __importStar(require("fs"));
function generateEctoSchema(models, outputPathDir) {
    if (!fs.existsSync(outputPathDir)) {
        fs.mkdirSync(outputPathDir, { recursive: true });
    }
    models.forEach((model) => {
        const schemaFileContent = `
defmodule MyApp.${model.name} do
  use Ecto.Schema
  import Ecto.Changeset

  schema "${model.name.toLowerCase()}" do
${model.fields
            .map((field) => `    field :${convertCamelToSnake(field.name)}, :${convertPrismaType(field.type)}`)
            .join("\n")}

       timestamps(type: :utc_datetime)
  end

  def changeset(${model.name.toLowerCase()}, attrs) do
    ${model.name.toLowerCase()}
    |> cast(attrs, [${model.fields
            .map((field) => `:${convertCamelToSnake(field.name)}`)
            .join(", ")}])
    |> validate_required([${model.fields
            .map((field) => `:${convertCamelToSnake(field.name)}`)
            .join(", ")}])
  end
end
`;
        fs.writeFileSync(`${outputPathDir}/${model.name.toLowerCase()}.ex`, schemaFileContent);
    });
}
exports.generateEctoSchema = generateEctoSchema;
function convertCamelToSnake(str) {
    let snakeCaseStr = str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").toLowerCase();
    console.log(str, snakeCaseStr);
    return snakeCaseStr;
}
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
