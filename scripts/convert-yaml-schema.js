// @ts-check
import { convertYamlToTypeScript } from './yaml-to-schema.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Define paths
const yamlSchemaPath = path.join(rootDir, 'schema.yml');
const tsSchemaPath = path.join(rootDir, 'app', 'lib', 'schema.ts');

async function main() {
  try {
    console.log('Starting YAML to TypeScript schema conversion...');
    await convertYamlToTypeScript(yamlSchemaPath, tsSchemaPath);
    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  }
}

// Run the main function
main();