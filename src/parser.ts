// src/parser.ts
import * as fs from "fs";

export interface PrismaField {
  name: string;
  type: string;
  isUnique: boolean;
  relationType?: 'one-to-one' | 'one-to-many' | 'many-to-many';
  relatedModel?: string;
}

export interface PrismaModel {
  name: string;
  fields: PrismaField[];
}

const PRIMITIVE_TYPES = new Set(['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json', 'Decimal']);

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
  const fieldPattern = /(\w+)\s+(\w+)(\[\])?(?:\s+@id)?(?:\s+@unique)?(?:\s+@relation\((?:fields:\s*\[(\w+)\],\s*)?references:\s*\[(\w+)\]\))?/g;
  const models: PrismaModel[] = [];
  let modelMatch;

  while ((modelMatch = modelPattern.exec(schemaContent)) !== null) {
    const [, modelName, modelContent] = modelMatch;
    const fields: PrismaField[] = [];
    let fieldMatch;

    while ((fieldMatch = fieldPattern.exec(modelContent)) !== null) {
      const [, fieldName, fieldType, isArray, isId, isUnique, relationField, referencedField] = fieldMatch;

      // Skip ID fields
      if (isId) continue;
      if (PRIMITIVE_TYPES.has(fieldName)) continue;
      


      // Determine if this field represents a relationship
      let relationType: PrismaField['relationType'] = undefined;
      let relatedModel: string | undefined = undefined;

      if (referencedField) {
        relatedModel = fieldType;

        if (isArray) {
          // Many-to-many or one-to-many based on array syntax
          relationType = 'many-to-many';
        } else {
          // One-to-one or one-to-many
          relationType = relationField ? 'one-to-many' : 'one-to-one';
        }
      }

      fields.push({
        name: fieldName,
        type: fieldType,
        isUnique: !!isUnique,
        relationType,
        relatedModel,
      });
    }

    models.push({ name: modelName, fields });
  }

  return models;
}