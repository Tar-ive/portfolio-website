'use client';

import { useEffect, useRef } from 'react';

interface TestMermaidProps {
  code: string;
}

export default function TestMermaid({ code }: TestMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          // Dynamic import of mermaid
          const mermaid = (await import('mermaid')).default;
          
          // Initialize mermaid
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
          });

          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Generate a unique ID for this diagram
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          // Render the diagram
          const { svg } = await mermaid.render(id, code.trim());
          
          // Insert the SVG into the container
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          containerRef.current.innerHTML = `
            <div class="p-4 border border-red-300 bg-red-50 rounded">
              <p class="text-red-700 font-semibold">Error rendering diagram</p>
              <pre class="text-sm text-red-600 mt-2">${code}</pre>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <div 
      ref={containerRef}
      className="my-6 flex justify-center"
      style={{ minHeight: '100px' }}
    />
  );
}