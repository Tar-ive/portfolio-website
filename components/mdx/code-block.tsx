'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { highlightCode, extractLanguage, isMermaidCode } from '@/lib/syntax-highlighting';
import { CodeBlockProps } from '@/lib/types';
import { useTheme } from 'next-themes';

export default function CodeBlock({
  children,
  className,
  language,
  showLineNumbers = false,
  highlightLines = [],
  filename,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  
  // Extract language from className or use provided language
  const detectedLanguage = language || extractLanguage(className);
  const codeContent = typeof children === 'string' ? children : String(children);
  
  // Check if this is a Mermaid diagram
  const isMermaid = isMermaidCode(codeContent, detectedLanguage);
  
  useEffect(() => {
    const highlightCodeAsync = async () => {
      if (isMermaid) {
        // Skip highlighting for Mermaid diagrams - they'll be handled by MermaidRenderer
        setHighlightedCode('');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const highlighted = await highlightCode(
          codeContent.trim(),
          detectedLanguage,
          theme === 'dark' ? 'dark' : 'light'
        );
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHighlightedCode('');
      } finally {
        setIsLoading(false);
      }
    };
    
    highlightCodeAsync();
  }, [codeContent, detectedLanguage, theme, isMermaid]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };
  
  // If this is a Mermaid diagram, it should be handled by MermaidRenderer in the parent
  // This is a fallback in case it reaches here
  if (isMermaid) {
    return (
      <div className="my-6 p-4 border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground mb-2">
          Mermaid diagram detected - should be rendered by MermaidRenderer
        </p>
        <pre className="overflow-x-auto rounded border bg-muted px-4 py-4">
          <code>{codeContent}</code>
        </pre>
      </div>
    );
  }
  
  return (
    <div className="relative group my-6">
      {/* Header with filename and language */}
      {(filename || detectedLanguage !== 'text') && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted border border-b-0 rounded-t-lg">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm font-medium text-foreground">
                {filename}
              </span>
            )}
            {detectedLanguage !== 'text' && (
              <Badge variant="secondary" className="text-xs">
                {detectedLanguage}
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="h-3 w-3" />
            ) : (
              <CopyIcon className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}
      
      {/* Code content */}
      <div className={cn(
        "relative overflow-x-auto",
        (filename || detectedLanguage !== 'text') ? "rounded-b-lg" : "rounded-lg"
      )}>
        {isLoading ? (
          <pre className="mb-0 mt-0 overflow-x-auto border bg-muted px-4 py-4">
            <code className="animate-pulse">Loading syntax highlighting...</code>
          </pre>
        ) : highlightedCode ? (
          <div 
            className={cn(
              "syntax-highlighted",
              showLineNumbers && "line-numbers"
            )}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        ) : (
          <pre className={cn(
            "mb-0 mt-0 overflow-x-auto border bg-muted px-4 py-4 font-mono text-sm",
            className
          )} {...props}>
            <code>{codeContent}</code>
          </pre>
        )}
        
        {/* Copy button for code without header */}
        {!(filename || detectedLanguage !== 'text') && (
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="h-3 w-3" />
            ) : (
              <CopyIcon className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}