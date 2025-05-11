export interface SchemaClass {
  label: string;
  comment?: string;
  schema?: string;
  subClassOf: string[];
  properties: string[];
  alternateType?: string;
}

export interface SchemaProperty {
  label: string;
  comment: string;
  baseVocab?: string;
  range: string[];
  domain: string[];
  alternateType?: string;
  inverseOf?: string;
}

export interface Schema {
  version: string;
  classes: Record<string, SchemaClass>;
  properties: Record<string, SchemaProperty>;
}

// Additional type aliases to match function signatures
export type ClassData = SchemaClass;
export type PropertyData = SchemaProperty;
export type SchemaData = Schema;