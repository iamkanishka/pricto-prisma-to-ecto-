// src/parser.ts
import * as fs from 'fs';

export interface PrismaModel {
  name: string;
  fields: { name: string; type: string; isId: boolean; isUnique: boolean }[];
}

export function parsePrismaSchema(filePath: string): PrismaModel[] {
  const schemaContent = fs.readFileSync(filePath, 'utf8');
  const modelPattern = /model\s+(\w+)\s*{([^}]*)}/g;
  const fieldPattern = /(\w+)\s+(\w+)(\s+\@id)?(\s+\@unique)?/g;

  const models: PrismaModel[] = [];

  let match;
  while ((match = modelPattern.exec(schemaContent)) !== null) {
    const [, modelName, modelContent] = match;
    const fields: PrismaModel['fields'] = [];

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

    models.push({ name: modelName, fields });
  }

  return models;
}
