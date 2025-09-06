'use client';

import { useEffect, useRef } from 'react';
import { isMermaidCode } from '@/lib/syntax-highlighting';

interface MermaidProcessorProps {
  children: React.ReactNode;
}

export default function MermaidProcessor({ children }: MermaidProcessorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processMermaidBlocks = async () => {
      if (!containerRef.current) return;

      // Find all code blocks with language-mermaid class
      const codeBlocks = containerRef.current.querySelectorAll('pre code.language-mermaid');
      
      if (codeBlocks.length === 0) return;

      try {
        // Dynamic import of mermaid
        const mermaid = (await import('mermaid')).default;
        
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        });

        // Process each mermaid code block
        for (let i = 0; i < codeBlocks.length; i++) {
          const codeBlock = codeBlocks[i];
          const code = codeBlock.textContent || '';
          
          // Verify this is actually mermaid code
          if (!isMermaidCode(code, 'mermaid')) continue;

          try {
            // Generate a unique ID for this diagram
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            
            // Render the diagram
            const { svg } = await mermaid.render(id, code.trim());
            
            // Create a new container for the diagram
            const diagramContainer = document.createElement('div');
            diagramContainer.className = 'my-6 flex justify-center';
            diagramContainer.innerHTML = svg;
            
            // Replace the pre/code block with the diagram
            const preElement = codeBlock.parentElement;
            if (preElement && preElement.tagName === 'PRE') {
              preElement.parentNode?.replaceChild(diagramContainer, preElement);
            }
          } catch (error) {
            console.error('Error rendering mermaid diagram:', error);
            
            // Create error display
            const errorContainer = document.createElement('div');
            errorContainer.className = 'my-6 p-4 border border-red-300 bg-red-50 rounded';
            errorContainer.innerHTML = `
              <p class="text-red-700 font-semibold">Error rendering diagram</p>
              <pre class="text-sm text-red-600 mt-2">${code}</pre>
            `;
            
            const preElement = codeBlock.parentElement;
            if (preElement && preElement.tagName === 'PRE') {
              preElement.parentNode?.replaceChild(errorContainer, preElement);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load mermaid:', error);
      }
    };

    // Process mermaid blocks after component mounts
    processMermaidBlocks();
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}