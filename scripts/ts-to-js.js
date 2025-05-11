// @ts-check
import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);

/**
 * Converts a TypeScript module to JavaScript and makes it importable
 * This is a simple workaround for build scripts that need to access TypeScript modules
 * @param {string} tsPath - Path to the TypeScript file
 * @returns {Promise<any>} - The module exports
 */
export async function requireFromTs(tsPath) {
  const resolvedPath = path.resolve(tsPath);
  try {
    const content = await fs.readFile(resolvedPath, 'utf8');
    
    // Replace TypeScript-specific syntax with JS equivalents
    const jsContent = content
      .replace(/import .* from .*;\n/g, '')  // Remove imports
      .replace(/export /g, '')  // Remove export keywords
      .replace(/: [a-zA-Z<>\[\]|{}]+/g, '') // Remove type annotations
      .replace(/interface [^{]+{[^}]+}/g, ''); // Remove interfaces
    
    // Create temp JS file
    const tempJsPath = `${resolvedPath}.temp.js`;
    await fs.writeFile(tempJsPath, jsContent);
    
    // Require the temp JS file
    const result = require(tempJsPath);
    
    // Clean up
    await fs.unlink(tempJsPath).catch(() => {});
    
    return result;
  } catch (error) {
    console.error(`Error processing TypeScript file: ${tsPath}`, error);
    throw error;
  }
}