// @ts-check
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts JSON schema data to Turtle format
 * @param {object} data - The schema data
 * @param {string} type - Type of entity: 'class', 'property', or 'schema'
 * @param {string} name - Name of the entity
 * @returns {string} - Turtle formatted data
 */
function convertToTurtle(data, type, name = '') {
  // Base prefixes for the Turtle format
  let turtle = `@prefix oer: <http://oerschema.org/> .
@prefix schema: <http://schema.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
\n`;
  
  if (type === 'schema') {
    // Convert full schema
    turtle += `# OER Schema v${data.version}\n\n`;
    
    // Add classes
    Object.keys(data.classes).forEach(className => {
      const classData = data.classes[className];
      
      turtle += `oer:${className} a rdfs:Class ;\n`;
      if (classData.label) turtle += `  rdfs:label "${classData.label}" ;\n`;
      if (classData.comment) turtle += `  rdfs:comment "${classData.comment}" ;\n`;
      
      // Add subClassOf relations
      if (classData.subClassOf && classData.subClassOf.length > 0) {
        classData.subClassOf.forEach((parent, index, array) => {
          const isLast = index === array.length - 1;
          // Handle external URLs vs local references
          if (parent.startsWith('http')) {
            turtle += `  rdfs:subClassOf <${parent}> ${isLast ? '.' : ';'}\n`;
          } else {
            turtle += `  rdfs:subClassOf oer:${parent} ${isLast ? '.' : ';'}\n`;
          }
        });
      } else {
        turtle += `  rdfs:subClassOf rdfs:Class .\n`;
      }
      
      turtle += '\n';
    });
    
    // Add properties
    Object.keys(data.properties).forEach(propName => {
      const propData = data.properties[propName];
      
      turtle += `oer:${propName} a rdf:Property ;\n`;
      if (propData.label) turtle += `  rdfs:label "${propData.label}" ;\n`;
      if (propData.comment) turtle += `  rdfs:comment "${propData.comment}" .\n\n`;
    });
    
  } else if (type === 'class') {
    // Convert single class
    turtle += `oer:${name} a rdfs:Class ;\n`;
    if (data.label) turtle += `  rdfs:label "${data.label}" ;\n`;
    if (data.comment) turtle += `  rdfs:comment "${data.comment}" ;\n`;
    
    // Add subClassOf relations
    if (data.subClassOf && data.subClassOf.length > 0) {
      data.subClassOf.forEach((parent, index, array) => {
        const isLast = index === array.length - 1;
        // Handle external URLs vs local references
        if (parent.startsWith('http')) {
          turtle += `  rdfs:subClassOf <${parent}> ${isLast ? '.' : ';'}\n`;
        } else {
          turtle += `  rdfs:subClassOf oer:${parent} ${isLast ? '.' : ';'}\n`;
        }
      });
    } else {
      turtle += `  rdfs:subClassOf rdfs:Class .\n`;
    }
    
    // Add properties that this class can use
    if (data.properties && data.properties.length > 0) {
      turtle += '\n# Properties that can be used with this class\n';
      data.properties.forEach(propName => {
        turtle += `oer:${propName} rdfs:domain oer:${name} .\n`;
      });
    }
    
  } else if (type === 'property') {
    // Convert single property
    turtle += `oer:${name} a rdf:Property ;\n`;
    if (data.label) turtle += `  rdfs:label "${data.label}" ;\n`;
    if (data.comment) turtle += `  rdfs:comment "${data.comment}" .\n`;
    
    // Add range if available
    if (data.range) {
      turtle += `oer:${name} rdfs:range oer:${data.range} .\n`;
    }
    
    // Add domain if available
    if (data.domain) {
      turtle += `oer:${name} rdfs:domain oer:${data.domain} .\n`;
    }
  }
  
  return turtle;
}

/**
 * Converts JSON schema data to N-Triples format
 * @param {object} data - The schema data
 * @param {string} type - Type of entity: 'class', 'property', or 'schema'
 * @param {string} name - Name of the entity
 * @returns {string} - N-Triples formatted data
 */
function convertToNTriples(data, type, name = '') {
  let triples = '';
  const baseURI = 'http://oerschema.org/';
  
  if (type === 'schema') {
    // Convert classes
    Object.keys(data.classes).forEach(className => {
      const classData = data.classes[className];
      
      // Class type declaration
      triples += `<${baseURI}${className}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .\n`;
      
      // Label
      if (classData.label) {
        triples += `<${baseURI}${className}> <http://www.w3.org/2000/01/rdf-schema#label> "${classData.label}" .\n`;
      }
      
      // Comment
      if (classData.comment) {
        triples += `<${baseURI}${className}> <http://www.w3.org/2000/01/rdf-schema#comment> "${classData.comment}" .\n`;
      }
      
      // SubClassOf relations
      if (classData.subClassOf && classData.subClassOf.length > 0) {
        classData.subClassOf.forEach(parent => {
          if (parent.startsWith('http')) {
            triples += `<${baseURI}${className}> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <${parent}> .\n`;
          } else {
            triples += `<${baseURI}${className}> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <${baseURI}${parent}> .\n`;
          }
        });
      }
    });
    
    // Convert properties
    Object.keys(data.properties).forEach(propName => {
      const propData = data.properties[propName];
      
      // Property type declaration
      triples += `<${baseURI}${propName}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> .\n`;
      
      // Label
      if (propData.label) {
        triples += `<${baseURI}${propName}> <http://www.w3.org/2000/01/rdf-schema#label> "${propData.label}" .\n`;
      }
      
      // Comment
      if (propData.comment) {
        triples += `<${baseURI}${propName}> <http://www.w3.org/2000/01/rdf-schema#comment> "${propData.comment}" .\n`;
      }
    });
    
  } else if (type === 'class') {
    // Class type declaration
    triples += `<${baseURI}${name}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .\n`;
    
    // Label
    if (data.label) {
      triples += `<${baseURI}${name}> <http://www.w3.org/2000/01/rdf-schema#label> "${data.label}" .\n`;
    }
    
    // Comment
    if (data.comment) {
      triples += `<${baseURI}${name}> <http://www.w3.org/2000/01/rdf-schema#comment> "${data.comment}" .\n`;
    }
    
    // SubClassOf relations
    if (data.subClassOf && data.subClassOf.length > 0) {
      data.subClassOf.forEach(parent => {
        if (parent.startsWith('http')) {
          triples += `<${baseURI}${name}> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <${parent}> .\n`;
        } else {
          triples += `<${baseURI}${name}> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <${baseURI}${parent}> .\n`;
        }
      });
    }
    
  } else if (type === 'property') {
    // Property type declaration
    triples += `<${baseURI}${name}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> .\n`;
    
    // Label
    if (data.label) {
      triples += `<${baseURI}${name}> <http://www.w3.org/2000/01/rdf-schema#label> "${data.label}" .\n`;
    }
    
    // Comment
    if (data.comment) {
      triples += `<${baseURI}${name}> <http://www.w3.org/2000/01/rdf-schema#comment> "${data.comment}" .\n`;
    }
    
    // Range
    if (data.range) {
      triples += `<${baseURI}${name}> <http://www.w3.org/2000/01/rdf-schema#range> <${baseURI}${data.range}> .\n`;
    }
    
    // Domain
    if (data.domain) {
      triples += `<${baseURI}${name}> <http://www.w3.org/2000/01/rdf-schema#domain> <${baseURI}${data.domain}> .\n`;
    }
  }
  
  return triples;
}

/**
 * Generate additional formats for schema data
 * @param {string} rootDir - The root directory for static files
 */
async function convertFormats(rootDir) {
  const schemaDir = path.join(rootDir, 'schema');
  const classesDir = path.join(schemaDir, 'class');
  const propertiesDir = path.join(schemaDir, 'property');
  
  console.log('Converting JSON data to additional formats...');
  
  try {
    // Process schema.json
    const schemaJsonPath = path.join(schemaDir, 'schema.json');
    const schemaJson = JSON.parse(await fs.readFile(schemaJsonPath, 'utf8'));
    
    // Generate Turtle
    const schemaTurtle = convertToTurtle(schemaJson, 'schema');
    await fs.writeFile(path.join(schemaDir, 'schema.ttl'), schemaTurtle);
    
    // Generate N-Triples
    const schemaNTriples = convertToNTriples(schemaJson, 'schema');
    await fs.writeFile(path.join(schemaDir, 'schema.nt'), schemaNTriples);
    
    // Process classes
    const classFiles = await fs.readdir(classesDir);
    for (const file of classFiles) {
      if (file.endsWith('.json') && !file.startsWith('index')) {
        const className = file.replace('.json', '');
        const classJsonPath = path.join(classesDir, file);
        const classData = JSON.parse(await fs.readFile(classJsonPath, 'utf8'));
        
        // Generate Turtle
        const classTurtle = convertToTurtle(classData, 'class', className);
        await fs.writeFile(path.join(classesDir, `${className}.ttl`), classTurtle);
        
        // Generate N-Triples
        const classNTriples = convertToNTriples(classData, 'class', className);
        await fs.writeFile(path.join(classesDir, `${className}.nt`), classNTriples);
        
        // Also write to the nested directory
        const classNestedDir = path.join(classesDir, className);
        if (await directoryExists(classNestedDir)) {
          await fs.writeFile(path.join(classNestedDir, 'index.ttl'), classTurtle);
          await fs.writeFile(path.join(classNestedDir, 'index.nt'), classNTriples);
        }
      }
    }
    
    // Process properties
    const propertyFiles = await fs.readdir(propertiesDir);
    for (const file of propertyFiles) {
      if (file.endsWith('.json') && !file.startsWith('index')) {
        const propertyName = file.replace('.json', '');
        const propertyJsonPath = path.join(propertiesDir, file);
        const propertyData = JSON.parse(await fs.readFile(propertyJsonPath, 'utf8'));
        
        // Generate Turtle
        const propertyTurtle = convertToTurtle(propertyData, 'property', propertyName);
        await fs.writeFile(path.join(propertiesDir, `${propertyName}.ttl`), propertyTurtle);
        
        // Generate N-Triples
        const propertyNTriples = convertToNTriples(propertyData, 'property', propertyName);
        await fs.writeFile(path.join(propertiesDir, `${propertyName}.nt`), propertyNTriples);
        
        // Also write to the nested directory
        const propertyNestedDir = path.join(propertiesDir, propertyName);
        if (await directoryExists(propertyNestedDir)) {
          await fs.writeFile(path.join(propertyNestedDir, 'index.ttl'), propertyTurtle);
          await fs.writeFile(path.join(propertyNestedDir, 'index.nt'), propertyNTriples);
        }
      }
    }
    
    console.log('Format conversion complete!');
    
  } catch (error) {
    console.error('Error during format conversion:', error);
  }
}

/**
 * Checks if a directory exists
 * @param {string} dir - Directory path
 * @returns {Promise<boolean>}
 */
async function directoryExists(dir) {
  try {
    const stats = await fs.stat(dir);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

export { convertFormats };