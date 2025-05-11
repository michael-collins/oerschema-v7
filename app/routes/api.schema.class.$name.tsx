import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "@remix-run/react";
import { schema } from "~/lib/schema";
import { 
  classToJsonLd, 
  classToXml, 
  classToTurtle, 
  classToJsonSchema,
  classToNTriples,
  classToRDFa,
  classToMicrodata
} from "~/lib/format-converters";

export default function ApiSchemaClassRoute() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const className = params.name || '';
  const format = searchParams.get("format") || "json";
  
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("application/json");
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const classData = schema.classes[className];
    if (!classData) {
      setError("Class not found");
      return;
    }
    
    const baseUrl = window.location.origin + "/";
    
    // Generate content based on requested format
    try {
      if (format === "jsonld") {
        setContent(classToJsonLd(className, classData, { baseUrl, pretty: true }));
        setContentType("application/ld+json");
      } else if (format === "schema") {
        setContent(classToJsonSchema(className, classData, { baseUrl, pretty: true }, schema));
        setContentType("application/schema+json");
      } else if (format === "xml") {
        setContent(classToXml(className, classData, { baseUrl }));
        setContentType("application/xml");
      } else if (format === "turtle") {
        setContent(classToTurtle(className, classData, { baseUrl }));
        setContentType("text/turtle");
      } else if (format === "ntriples") {
        setContent(classToNTriples(className, classData, { baseUrl }));
        setContentType("application/n-triples");
      } else if (format === "rdfa") {
        setContent(classToRDFa(className, classData, { baseUrl }));
        setContentType("text/html+rdfa");
      } else if (format === "microdata") {
        setContent(classToMicrodata(className, classData, { baseUrl }));
        setContentType("text/html+microdata");
      } else {
        // Default to JSON
        setContent(JSON.stringify({ className, ...classData }, null, 2));
        setContentType("application/json");
      }
    } catch (err) {
      setError(`Error generating ${format} format: ${err}`);
    }
  }, [className, format]);
  
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