import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "About - OER Schema" },
    { name: "description", content: "About the Open Educational Resources Schema" },
  ];
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">About OER Schema</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is OER Schema?</h2>
          <p className="mb-4">
            OER Schema is a vocabulary for describing Open Educational Resources (OER) and their relationships.
            It provides a standardized way to mark up educational content, making it more discoverable and interoperable.
          </p>
          <p className="mb-4">
            By using this schema, content creators, educators, and platform developers can create a more 
            connected and reusable ecosystem of educational resources.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">History and Development</h2>
          <p className="mb-4">
            OER Schema was developed to address the need for better metadata in the open education community. 
            It builds on standards like schema.org while adding specific terms relevant to educational contexts.
          </p>
          <p className="mb-4">
            The schema is maintained through a collaborative process and continues to evolve to meet the changing needs of the OER ecosystem.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Contribute</h2>
          <p className="mb-4">
            OER Schema is an open community initiative. Contributions are welcome in various forms:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Suggesting new terms or modifications to existing ones</li>
            <li className="mb-2">Providing examples of schema implementation</li>
            <li className="mb-2">Reporting issues or inconsistencies</li>
            <li className="mb-2">Creating tools that work with the schema</li>
          </ul>
          <p>
            Visit the <a href="https://github.com/oerschema" className="text-blue-600 hover:underline">GitHub repository</a> to get involved.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p>
            For questions, suggestions, or more information about OER Schema, please reach out through 
            our <a href="https://github.com/oerschema" className="text-blue-600 hover:underline">GitHub page</a> 
            or contact the maintainers directly.
          </p>
        </section>
      </div>
    </div>
  );
}