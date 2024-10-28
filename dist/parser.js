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
exports.parsePrismaSchema = parsePrismaSchema;
// src/parser.ts
const fs = __importStar(require("fs"));
function parsePrismaSchema(filePath) {
    const schemaContent = fs.readFileSync(filePath, 'utf8');
    const modelPattern = /model\s+(\w+)\s*{([^}]*)}/g;
    const fieldPattern = /(\w+)\s+(\w+)(\s+\@id)?(\s+\@unique)?/g;
    const models = [];
    let match;
    while ((match = modelPattern.exec(schemaContent)) !== null) {
        const [, modelName, modelContent] = match;
        const fields = [];
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
