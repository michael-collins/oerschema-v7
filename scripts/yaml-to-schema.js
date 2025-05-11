// @ts-check
import fs from 'fs/promises';
import yaml from 'js-yaml';

/**
 * Converts a YAML schema file to TypeScript
 * @param {string} yamlPath - Path to the YAML schema file
 * @param {string} tsPath - Path where the TypeScript file should be written
 */
export async function convertYamlToTypeScript(yamlPath, tsPath) {
  try {
    // Read the YAML file
    const yamlContent = await fs.readFile(yamlPath, 'utf8');
    
    // Parse the YAML content
    const schemaObject = yaml.load(yamlContent);
    
    // Generate TypeScript code
    const tsContent = generateTypeScriptCode(schemaObject);
    
    // Write the TypeScript file
    await fs.writeFile(tsPath, tsContent, 'utf8');
    
    console.log(`Successfully converted YAML schema to TypeScript: ${tsPath}`);
  } catch (error) {
    console.error('Error converting YAML to TypeScript:', error);
    throw error;
  }
}

/**
 * Generates TypeScript code from the schema object
 * @param {object} schema - The schema object parsed from YAML
 * @returns {string} The TypeScript code as a string
 */
function generateTypeScriptCode(schema) {
  // Generate TypeScript interfaces for schema types
  const interfaces = `
export interface SchemaClass {
  id: string;
  label: string;
  comment?: string;
  subClassOf?: string | string[];
  equivalentTo?: string | string[];
  properties?: string[];
  examples?: string[];
  status?: string;
  statusNote?: string;
  supersededBy?: string;
  [key: string]: any;
}

export interface SchemaProperty {
  id: string;
  label: string;
  comment?: string;
  domain?: string | string[];
  range?: string | string[];
  subPropertyOf?: string | string[];
  equivalentTo?: string | string[];
  inverseOf?: string;
  examples?: string[];
  status?: string;
  statusNote?: string;
  supersededBy?: string;
  [key: string]: any;
}

export interface Schema {
  classes: Record<string, SchemaClass>;
  properties: Record<string, SchemaProperty>;
  [key: string]: any;
}`;

  // Convert the schema object to a pretty-printed string
  const schemaString = JSON.stringify(schema, null, 2)
    // Fix quotes around keys (use double quotes)
    .replace(/"([^"]+)":/g, '$1:');

  // Combine the interfaces and schema export
  return `/**
 * Generated from schema.yml - DO NOT EDIT DIRECTLY
 * To modify the schema, update the YAML file and regenerate this file
 */
${interfaces}

export const schema: Schema = ${schemaString};
`;
}