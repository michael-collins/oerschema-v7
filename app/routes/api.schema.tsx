import { useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { schema } from "~/lib/schema";
import { schemaToJsonLd, schemaToXml, schemaToTurtle } from "~/lib/format-converters";

export default function ApiSchemaRoute() {
  const [searchParams] = useSearchParams();
  const format = searchParams.get("format") || "json";
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("application/json");
  
  useEffect(() => {
    const baseUrl = window.location.origin + "/";
    
    // Generate content based on requested format
    if (format === "jsonld") {
      setContent(schemaToJsonLd(schema, { baseUrl, pretty: true }));
      setContentType("application/ld+json");
    } else if (format === "xml") {
      setContent(schemaToXml(schema, { baseUrl }));
      setContentType("application/xml");
    } else if (format === "turtle") {
      setContent(schemaToTurtle(schema, { baseUrl }));
      setContentType("text/turtle");
    } else {
      // Default to JSON
      setContent(JSON.stringify(schema, null, 2));
      setContentType("application/json");
    }
  }, [format]);

  return (
    <pre className="p-4 overflow-auto bg-card border rounded-md text-sm whitespace-pre-wrap">
      {content}
    </pre>
  );
}

// Helper functions for format conversions
function schemaToJsonLd(schema: any, options: { baseUrl?: string; pretty?: boolean } = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  const context = {
    "oer": baseUrl,
    "schema": "http://schema.org/",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "Class": "rdfs:Class",
    "Property": "rdf:Property",
    "subClassOf": { "@id": "rdfs:subClassOf", "@type": "@id" },
    "comment": "rdfs:comment",
    "label": "rdfs:label",
    "domain": { "@id": "rdfs:domain", "@type": "@id" },
    "range": { "@id": "rdfs:range", "@type": "@id" }
  };

  const jsonLd = {
    "@context": context,
    "@graph": []
  };

  // Add classes
  Object.entries(schema.classes).forEach(([className, classData]) => {
    const classEntry = {
      "@id": `oer:${className}`,
      "@type": "Class",
      "label": classData.label || className,
      "comment": classData.comment,
      "subClassOf": classData.subClassOf.map((parent: string) => {
        return parent.startsWith('http://') ? parent : `oer:${parent}`;
      }),
      "properties": classData.properties
    };
    
    jsonLd["@graph"].push(classEntry);
  });

  // Add properties
  Object.entries(schema.properties).forEach(([propName, propData]) => {
    const propEntry = {
      "@id": `oer:${propName}`,
      "@type": "Property",
      "label": propData.label || propName,
      "comment": propData.comment,
      "domain": propData.domain.map((domain: string) => {
        return domain.startsWith('http://') ? domain : `oer:${domain}`;
      }),
      "range": propData.range.map((range: string) => {
        return range.startsWith('http://') ? range : `oer:${range}`;
      })
    };
    
    jsonLd["@graph"].push(propEntry);
  });

  return options.pretty ? JSON.stringify(jsonLd, null, 2) : JSON.stringify(jsonLd);
}

function schemaToXml(schema: any, options: { baseUrl?: string } = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n';
  xml += '         xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\n';
  xml += `         xmlns:oer="${baseUrl}"\n`;
  xml += '         xmlns:schema="http://schema.org/">\n\n';
  
  // Add classes
  Object.entries(schema.classes).forEach(([className, classData]) => {
    xml += `  <rdfs:Class rdf:about="${baseUrl}${className}">\n`;
    
    // Add label
    if (classData.label) {
      xml += `    <rdfs:label>${escapeXml(classData.label)}</rdfs:label>\n`;
    }
    
    // Add comment
    if (classData.comment) {
      xml += `    <rdfs:comment>${escapeXml(classData.comment)}</rdfs:comment>\n`;
    }
    
    // Add parent classes
    for (const parent of classData.subClassOf) {
      const parentUri = parent.startsWith('http://') ? parent : `${baseUrl}${parent}`;
      xml += `    <rdfs:subClassOf rdf:resource="${parentUri}"/>\n`;
    }
    
    // Add properties
    if (classData.properties && classData.properties.length > 0) {
      for (const prop of classData.properties) {
        xml += `    <oer:properties>${prop}</oer:properties>\n`;
      }
    }
    
    xml += '  </rdfs:Class>\n\n';
  });

  // Add properties
  Object.entries(schema.properties).forEach(([propName, propData]) => {
    xml += `  <rdf:Property rdf:about="${baseUrl}${propName}">\n`;
    
    // Add label
    if (propData.label) {
      xml += `    <rdfs:label>${escapeXml(propData.label)}</rdfs:label>\n`;
    }
    
    // Add comment
    if (propData.comment) {
      xml += `    <rdfs:comment>${escapeXml(propData.comment)}</rdfs:comment>\n`;
    }
    
    // Add range
    for (const range of propData.range) {
      const rangeUri = range.startsWith('http://') ? range : `${baseUrl}${range}`;
      xml += `    <rdfs:range rdf:resource="${rangeUri}"/>\n`;
    }
    
    // Add domain
    for (const domain of propData.domain) {
      const domainUri = domain.startsWith('http://') ? domain : `${baseUrl}${domain}`;
      xml += `    <rdfs:domain rdf:resource="${domainUri}"/>\n`;
    }
    
    xml += '  </rdf:Property>\n\n';
  });

  xml += '</rdf:RDF>';
  
  return xml;
}

function schemaToTurtle(schema: any, options: { baseUrl?: string } = {}) {
  const baseUrl = options.baseUrl || "http://oerschema.org/";
  
  let turtle = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`;
  turtle += `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`;
  turtle += `@prefix oer: <${baseUrl}> .\n`;
  turtle += `@prefix schema: <http://schema.org/> .\n\n`;
  
  // Add classes
  Object.entries(schema.classes).forEach(([className, classData]) => {
    turtle += `oer:${className} a rdfs:Class`;
    
    // Add label
    if (classData.label) {
      turtle += ` ;\n    rdfs:label "${classData.label}"`;
    }
    
    // Add comment
    if (classData.comment) {
      turtle += ` ;\n    rdfs:comment "${escapeTurtle(classData.comment)}"`;
    }
    
    // Add parent classes
    if (classData.subClassOf && classData.subClassOf.length > 0) {
      for (let i = 0; i < classData.subClassOf.length; i++) {
        const parent = classData.subClassOf[i];
        const parentUri = parent.startsWith('http://') ? `<${parent}>` : `oer:${parent}`;
        turtle += ` ;\n    rdfs:subClassOf ${parentUri}`;
      }
    }
    
    // Add properties
    if (classData.properties && classData.properties.length > 0) {
      for (let i = 0; i < classData.properties.length; i++) {
        turtle += ` ;\n    oer:properties "${classData.properties[i]}"`;
      }
    }
    
    turtle += ' .\n\n';
  });

  // Add properties
  Object.entries(schema.properties).forEach(([propName, propData]) => {
    turtle += `oer:${propName} a rdf:Property`;
    
    // Add label
    if (propData.label) {
      turtle += ` ;\n    rdfs:label "${propData.label}"`;
    }
    
    // Add comment
    if (propData.comment) {
      turtle += ` ;\n    rdfs:comment "${escapeTurtle(propData.comment)}"`;
    }
    
    // Add range
    if (propData.range && propData.range.length > 0) {
      for (let i = 0; i < propData.range.length; i++) {
        const range = propData.range[i];
        const rangeUri = range.startsWith('http://') ? `<${range}>` : `oer:${range}`;
        turtle += ` ;\n    rdfs:range ${rangeUri}`;
      }
    }
    
    // Add domain
    if (propData.domain && propData.domain.length > 0) {
      for (let i = 0; i < propData.domain.length; i++) {
        const domain = propData.domain[i];
        const domainUri = domain.startsWith('http://') ? `<${domain}>` : `oer:${domain}`;
        turtle += ` ;\n    rdfs:domain ${domainUri}`;
      }
    }
    
    turtle += ' .\n\n';
  });
  
  return turtle;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function escapeTurtle(unsafe: string): string {
  return unsafe.replace(/["\\]/g, function (c) {
    switch (c) {
      case '"': return '\\"';
      case '\\': return '\\\\';
      default: return c;
    }
  });
}