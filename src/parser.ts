// src/parser.ts
import * as fs from "fs";

export interface PrismaModel {
  name: string;
  fields: { name: string; type: string; isId: boolean; isUnique: boolean }[];
}

export function parsePrismaSchema(filePath: string): PrismaModel[] {
  if (!fs.existsSync(filePath)) {
    console.error(
      "\x1b[31mError: " +
        "Sorry Could not find the schema.prisma file" +
        "\x1b[0m"
    );

    console.warn(
      "\x1b[33mNote:" +
        " Please make sure following folder structure ./prisma/prisma.schema ." +
        "\x1b[0m"
    );
    console.info(
      "\x1b[36mInfo:" +
        " Try running  `prisma-to-ecto convert <custom-prismaschemapath>` for custom schema path" +
        "\x1b[0m"
    );
    process.exit(1);
  }

  const schemaContent = fs.readFileSync(filePath, "utf8");
  const modelPattern = /model\s+(\w+)\s*{([^}]*)}/g;
  const fieldPattern = /(\w+)\s+(\w+)(\s+\@id)?(\s+\@unique)?/g;

  const models: PrismaModel[] = [];

  let match;
  while ((match = modelPattern.exec(schemaContent)) !== null) {
    const [, modelName, modelContent] = match;
    const fields: PrismaModel["fields"] = [];

    let fieldMatch;
    while ((fieldMatch = fieldPattern.exec(modelContent)) !== null) {
      const [, fieldName, fieldType, isId, isUnique] = fieldMatch;
      fields.push({
        name: fieldName,
        type: fieldType,
        isId: !!isId,
        isUnique: !!isUnique,
      });
    }

    console.log( modelName , fields );
    
    models.push({ name: modelName, fields });
  }

  return models;
}

