// @ts-check
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertFormats } from './format-converter.js';
import { convertYamlToTypeScript } from './yaml-to-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const appDir = path.join(__dirname, '..');
const yamlPath = path.join(appDir, 'schema.yml');
const schemaPath = path.join(appDir, 'app', 'lib', 'schema.ts');
const staticDir = path.join(appDir, 'public', 'static');
const schemaDir = path.join(staticDir, 'schema');

/**
 * Extract schema data from the schema.ts TypeScript file
 * @returns {Promise<object>} Parsed schema object
 */
async function extractSchemaData() {
  try {
    // Read the file content
    const fileContent = await fs.readFile(schemaPath, 'utf8');
    
    // Extract the schema object from TypeScript file
    // First try a simple regex to extract the JSON directly
    const schemaMatch = fileContent.match(/export\s+const\s+schema(?::\s*\w+)?\s*=\s*({[\s\S]*?});/);
    
    if (!schemaMatch || !schemaMatch[1]) {
      throw new Error('Could not find schema definition in schema.ts');
    }
    
    // Get the raw schema string
    let schemaString = schemaMatch[1];
    
    // Convert TypeScript to valid JSON
    // Remove comments (both single-line and multi-line)
    schemaString = schemaString.replace(/\/\/.*$/gm, '')
                              .replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Ensure property names are double-quoted (only if they aren't already)
    schemaString = schemaString.replace(/([{,]\s*)(\b[a-zA-Z_][a-zA-Z0-9_]*\b)(\s*:)/g, '$1"$2"$3');
    
    // Make sure all URLs are properly quoted
    schemaString = schemaString.replace(/(["']?)(https?:\/\/[^"',\s)}\]]+)(\1)/g, (match, startQuote, url, endQuote) => {
      if (startQuote === '"' || startQuote === "'") {
        return match; // Already quoted
      }
      return `"${url}"`; // Add quotes
    });
    
    // Handle single quotes to double quotes for JSON compatibility
    schemaString = schemaString.replace(/'([^']*)'/g, '"$1"');
    
    // Remove trailing commas which are invalid in JSON
    schemaString = schemaString.replace(/,(\s*[}\]])/g, '$1');
    
    // Manually parse and fix any remaining issues
    let schema;
    try {
      console.log('Attempting to parse schema...');
      schema = JSON.parse(schemaString);
      console.log('Schema parsed successfully!');
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      console.error('Error location:', jsonError.message);
      
      // Try a more aggressive approach to fix the JSON
      // Remove any other TypeScript-specific syntax
      schemaString = schemaString
        // Remove type annotations
        .replace(/:\s*[A-Za-z<>[\]|]+(?=\s*[,=}])/g, '')
        // Fix arrays with undefined elements
        .replace(/\[([^[\]]*),\s*,([^[\]]*)\]/g, '[$1,$2]')
        // Fix any "undefined" values (replace with null)
        .replace(/:\s*undefined\s*([,}])/g, ': null$1');
      
      try {
        console.log('Retrying with more aggressive parsing...');
        schema = JSON.parse(schemaString);
        console.log('Schema parsed successfully on second attempt!');
      } catch (retryError) {
        console.error('Second parsing attempt failed:', retryError);
        // Save the problematic JSON to a file for debugging
        const debugPath = path.join(schemaDir, 'debug-schema.txt');
        await fs.writeFile(debugPath, schemaString);
        console.error(`Saved problematic schema to ${debugPath} for debugging`);
        
        console.error('Falling back to a simpler approach...');
        
        // Write a JSON file with the basic structure and return a simplified schema
        await fs.writeFile(
          path.join(schemaDir, 'index.json'),
          JSON.stringify({ error: "Schema parsing failed" }, null, 2)
        );
        
        return {
          classes: {},
          properties: {}
        };
      }
    }
    
    return schema;
  } catch (error) {
    console.error('Error extracting schema data:', error);
    throw error;
  }
}

/**
 * Ensure all necessary directories exist
 */
async function ensureDirectories() {
  try {
    // Create the main directories
    await fs.mkdir(staticDir, { recursive: true });
    await fs.mkdir(schemaDir, { recursive: true });
    await fs.mkdir(path.join(schemaDir, 'class'), { recursive: true });
    await fs.mkdir(path.join(schemaDir, 'property'), { recursive: true });
    
    console.log('Created directory structure');
  } catch (error) {
    console.error('Error creating directories:', error);
    throw error;
  }
}

/**
 * Generate static API files for schema, classes, and properties
 * @param {object} schema - The schema object
 */
async function generateStaticFiles(schema) {
  try {
    console.log('Generating static API files...');
    
    // Generate schema.json
    await fs.writeFile(
      path.join(schemaDir, 'schema.json'),
      JSON.stringify(schema, null, 2)
    );
    console.log('Generated schema.json');
    
    // Generate index.json for classes
    const classesIndex = Object.keys(schema.classes).map(className => ({
      name: className,
      label: schema.classes[className].label || className,
      url: `/schema/class/${className}`
    }));
    
    await fs.writeFile(
      path.join(schemaDir, 'class', 'index.json'),
      JSON.stringify(classesIndex, null, 2)
    );
    console.log('Generated class/index.json');
    
    // Generate individual class files
    for (const className of Object.keys(schema.classes)) {
      const classData = schema.classes[className];
      
      // Generate enhanced class data with additional information
      const enhancedClassData = {
        ...classData,
        name: className,
        properties: Object.keys(schema.properties).filter(propName => {
          const prop = schema.properties[propName];
          const domain = prop.domain;
          
          // Handle different domain formats
          if (!domain) return false;
          if (typeof domain === 'string') return domain === className;
          if (Array.isArray(domain)) return domain.includes(className);
          return false;
        })
      };
      
      // Write class JSON file
      await fs.writeFile(
        path.join(schemaDir, 'class', `${className}.json`),
        JSON.stringify(enhancedClassData, null, 2)
      );
      
      // Create directory for the class to support /schema/class/ClassName/ URLs
      const classDir = path.join(schemaDir, 'class', className);
      await fs.mkdir(classDir, { recursive: true });
      
      // Write index.json in the class directory
      await fs.writeFile(
        path.join(classDir, 'index.json'),
        JSON.stringify(enhancedClassData, null, 2)
      );
    }
    console.log('Generated individual class files');
    
    // Generate index.json for properties
    const propertiesIndex = Object.keys(schema.properties).map(propName => ({
      name: propName,
      label: schema.properties[propName].label || propName,
      url: `/schema/property/${propName}`
    }));
    
    await fs.writeFile(
      path.join(schemaDir, 'property', 'index.json'),
      JSON.stringify(propertiesIndex, null, 2)
    );
    console.log('Generated property/index.json');
    
    // Generate individual property files
    for (const propName of Object.keys(schema.properties)) {
      const propData = schema.properties[propName];
      
      // Generate enhanced property data with additional information
      const enhancedPropData = {
        ...propData,
        name: propName
      };
      
      // Write property JSON file
      await fs.writeFile(
        path.join(schemaDir, 'property', `${propName}.json`),
        JSON.stringify(enhancedPropData, null, 2)
      );
      
      // Create directory for the property to support /schema/property/propertyName/ URLs
      const propDir = path.join(schemaDir, 'property', propName);
      await fs.mkdir(propDir, { recursive: true });
      
      // Write index.json in the property directory
      await fs.writeFile(
        path.join(propDir, 'index.json'),
        JSON.stringify(enhancedPropData, null, 2)
      );
    }
    console.log('Generated individual property files');
    
    // Convert to additional formats (Turtle, N-Triples, etc.)
    await convertFormats(path.join(staticDir));
    
    console.log('Static API generation complete!');
  } catch (error) {
    console.error('Error generating static files:', error);
    throw error;
  }
}

/**
 * Main function to generate the static API
 */
async function main() {
  try {
    console.log('Starting static API generation...');
    
    // First step: Convert YAML to TypeScript
    if (await fileExists(yamlPath)) {
      console.log('YAML schema file found, converting to TypeScript...');
      await convertYamlToTypeScript(yamlPath, schemaPath);
      console.log('YAML to TypeScript conversion completed');
    } else {
      console.warn(`YAML schema file not found at ${yamlPath}, skipping conversion step`);
      console.warn('Will use existing schema.ts file');
    }
    
    // Ensure directories exist
    await ensureDirectories();
    
    // Extract schema data from the TypeScript file (which was just generated from YAML)
    const schema = await extractSchemaData();
    
    // Generate static files
    await generateStaticFiles(schema);
    
    console.log('Static API generation completed successfully!');
  } catch (error) {
    console.error('Error in static API generation:', error);
    process.exit(1);
  }
}

/**
 * Helper function to check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} Whether the file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Run the main function
main();