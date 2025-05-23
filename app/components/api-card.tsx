import React, { useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';

type ApiCardProps = {
  type: 'class' | 'property';
  name: string;
}

export function ApiCard({ type, name }: ApiCardProps) {
  const location = useLocation();
  const endpoint = `/api/schema/${type}/${name}`;
  const [origin, setOrigin] = useState("");
  
  // Set origin on client-side only to avoid SSR issues with window
  useEffect(() => {
    setOrigin(window.location.origin);
    
    // Define the click handler function
    const handleFormatLinkClick = (e: Event) => {
      e.preventDefault();
      const element = e.target as HTMLElement;
      const linkElement = element.closest('a');
      if (!linkElement) return;
      
      const acceptType = linkElement.getAttribute('data-accept');
      if (!acceptType) return;
      
      const url = linkElement.getAttribute('href');
      if (!url) return;
      
      // Create a fetch request with the proper Accept header
      fetch(url, {
        headers: {
          'Accept': acceptType
        }
      })
      .then(response => {
        // Handle the response based on content type
        const contentType = response.headers.get('Content-Type');
        return response.blob().then(blob => {
          // Create a blob URL and trigger download or open in new tab
          const blobUrl = URL.createObjectURL(new Blob([blob], { type: contentType || acceptType }));
          
          // Create a temporary link and click it
          const tempLink = document.createElement('a');
          tempLink.href = blobUrl;
          
          // Set a filename based on the resource and format
          const format = acceptType.split('/').pop();
          tempLink.setAttribute('download', `${type}-${name}.${getFileExtension(acceptType)}`);
          
          // If it's JSON or JSON-LD just open in new tab instead of downloading
          if (acceptType.includes('json') || acceptType.includes('html')) {
            window.open(blobUrl, '_blank');
          } else {
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
          }
          
          // Clean up
          URL.revokeObjectURL(blobUrl);
        });
      })
      .catch(error => {
        console.error('Error fetching resource:', error);
      });
    };
    
    // Add client-side handler for format links
    const formatLinks = document.querySelectorAll('a[data-accept]');
    formatLinks.forEach(link => {
      link.addEventListener('click', handleFormatLinkClick);
    });
    
    return () => {
      // Clean up event listeners on unmount
      const formatLinks = document.querySelectorAll('a[data-accept]');
      formatLinks.forEach(link => {
        link.removeEventListener('click', handleFormatLinkClick);
      });
    };
  }, [endpoint, type, name]);
  
  // Helper function to get file extension from content type
  const getFileExtension = (contentType: string): string => {
    if (contentType.includes('json')) return 'json';
    if (contentType.includes('xml')) return 'xml';
    if (contentType.includes('turtle')) return 'ttl';
    if (contentType.includes('n-triples')) return 'nt';
    if (contentType.includes('html+rdfa') || contentType.includes('rdfa')) return 'html';
    if (contentType.includes('html+microdata') || contentType.includes('microdata')) return 'html';
    return 'txt';
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Endpoint:</h3>
        <div className="bg-muted p-4 rounded-md overflow-auto">
          <code className="whitespace-pre-wrap break-all">{endpoint}</code>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Available formats:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <a 
              className="text-primary hover:underline break-words" 
              href={endpoint}
              data-accept="application/json"
            >
              JSON - <code>application/json</code>
            </a>
          </li>
          <li>
            <a 
              className="text-primary hover:underline break-words" 
              href={endpoint}
              data-accept="application/ld+json"
            >
              JSON-LD - <code>application/ld+json</code>
            </a>
          </li>
          <li>
            <a 
              className="text-primary hover:underline break-words" 
              href={endpoint}
              data-accept="application/schema+json"
            >
              JSON Schema - <code>application/schema+json</code>
            </a>
          </li>
          <li>
            <a 
              className="text-primary hover:underline break-words" 
              href={endpoint}
              data-accept="application/xml"
            >
              XML - <code>application/xml</code>
            </a>
          </li>
          <li>
            <a 
              className="text-primary hover:underline break-words" 
              href={endpoint}
              data-accept="text/turtle"
            >
              Turtle - <code>text/turtle</code>
            </a>
          </li>
          <li>
            <a 
              className="text-primary hover:underline break-words" 
              href={endpoint}
              data-accept="application/n-triples"
            >
              N-Triples - <code>application/n-triples</code>
            </a>
          </li>
          <li>
            <a 
              className="text-primary hover:underline break-words" 
              href={endpoint}
              data-accept="text/html+rdfa"
            >
              RDFa - <code>text/html+rdfa</code>
            </a>
          </li>
          <li>
            <a 
              className="text-primary hover:underline break-words" 
              href={endpoint}
              data-accept="text/html+microdata"
            >
              Microdata - <code>text/html+microdata</code>
            </a>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Example usage:</h3>
        <div className="bg-muted p-4 rounded-md overflow-auto">
          <code className="whitespace-pre-wrap break-all md:break-normal">{`curl -H "Accept: application/json" ${origin}${endpoint}`}</code>
        </div>
      </div>
    </div>
  );
}