'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface SimpleMermaidProps {
  code: string;
  className?: string;
}

export default function SimpleMermaid({ code, className }: SimpleMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  

  
  useEffect(() => {
    // Render the diagram with dynamic import
    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Dynamic import to avoid bundling mermaid in serverless functions
          const { default: mermaid } = await import('mermaid');
          
          // Initialize mermaid
          mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          });
          
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
  }, [code, theme]);

  return (
    <div 
      ref={containerRef}
      className={`my-6 flex justify-center ${className || ''}`}
      style={{ minHeight: '100px' }}
    />
  );
}