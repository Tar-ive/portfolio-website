'use client';

import { Suspense } from 'react';
import CodeBlock from './code-block';
import SimpleMermaid from './simple-mermaid';
import { isMermaidCode } from '@/lib/syntax-highlighting';

interface CodeWrapperProps {
  children: string;
  className?: string;
  language?: string;
}

export default function CodeWrapper({ children, className, language, ...props }: CodeWrapperProps) {
  // Extract language from className
  const detectedLanguage = language || className?.replace('language-', '') || '';
  
  // Check if this is a Mermaid diagram
  const isMermaid = detectedLanguage === 'mermaid' || (typeof children === 'string' && isMermaidCode(children, detectedLanguage));
  
  if (isMermaid) {
    return (
      <Suspense fallback={
        <div className="my-6 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">mermaid</span>
            <div className="text-sm text-muted-foreground">Loading diagram...</div>
          </div>
          <div className="flex items-center justify-center p-8 min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      }>
        <SimpleMermaid code={children} />
      </Suspense>
    );
  }
  
  return (
    <Suspense fallback={
      <pre className="mb-0 mt-0 overflow-x-auto border bg-muted px-4 py-4 font-mono text-sm">
        <code>Loading...</code>
      </pre>
    }>
      <CodeBlock className={className} {...props}>
        {children}
      </CodeBlock>
    </Suspense>
  );
}