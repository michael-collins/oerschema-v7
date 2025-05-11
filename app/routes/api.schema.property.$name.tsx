import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "@remix-run/react";
import { schema } from "~/lib/schema";
import { 
  propertyToJsonLd, 
  propertyToXml, 
  propertyToTurtle,
  propertyToJsonSchema,
  propertyToNTriples,
  propertyToRDFa,
  propertyToMicrodata
} from "~/lib/format-converters";

export default function ApiSchemaPropertyRoute() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const propertyName = params.name || '';
  const format = searchParams.get("format") || "json";
  
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("application/json");
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const propertyData = schema.properties[propertyName];
    if (!propertyData) {
      setError("Property not found");
      return;
    }
    
    const baseUrl = window.location.origin + "/";
    
    // Generate content based on requested format
    try {
      if (format === "jsonld") {
        setContent(propertyToJsonLd(propertyName, propertyData, { baseUrl, pretty: true }));
        setContentType("application/ld+json");
      } else if (format === "schema") {
        setContent(propertyToJsonSchema(propertyName, propertyData, { baseUrl, pretty: true }));
        setContentType("application/schema+json");
      } else if (format === "xml") {
        setContent(propertyToXml(propertyName, propertyData, { baseUrl }));
        setContentType("application/xml");
      } else if (format === "turtle") {
        setContent(propertyToTurtle(propertyName, propertyData, { baseUrl }));
        setContentType("text/turtle");
      } else if (format === "ntriples") {
        setContent(propertyToNTriples(propertyName, propertyData, { baseUrl }));
        setContentType("application/n-triples");
      } else if (format === "rdfa") {
        setContent(propertyToRDFa(propertyName, propertyData, { baseUrl }));
        setContentType("text/html+rdfa");
      } else if (format === "microdata") {
        setContent(propertyToMicrodata(propertyName, propertyData, { baseUrl }));
        setContentType("text/html+microdata");
      } else {
        // Default to JSON
        setContent(JSON.stringify({ propertyName, ...propertyData }, null, 2));
        setContentType("application/json");
      }
    } catch (err) {
      setError(`Error generating ${format} format: ${err}`);
    }
  }, [propertyName, format]);
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <h1 className="text-xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <pre className="p-4 overflow-auto bg-card border rounded-md text-sm whitespace-pre-wrap">
      {content}
    </pre>
  );
}