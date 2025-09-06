'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CodeBlock from './code-block';
import { isMermaidCode } from '@/lib/syntax-highlighting';
import PDFLink from './pdf-link';
import dynamic from 'next/dynamic';

// Dynamically import the working Mermaid component to avoid SSR issues
const SimpleMermaid = dynamic(() => import('./simple-mermaid'), {
  ssr: false,
  loading: () => (
    <div className="my-6 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">mermaid</span>
        <div className="text-sm text-muted-foreground">Loading diagram...</div>
      </div>
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>
  ),
});

// Enhanced typography components with shadcn/ui styling
const TypographyComponents = {
  h1: ({ children, ...props }: any) => (
    <h1 
      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" 
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4" 
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 
      className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3" 
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 
      className="scroll-m-20 text-xl font-semibold tracking-tight mb-2" 
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
      {children}
    </p>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props}>
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="mt-2" {...props}>
      {children}
    </li>
  ),
  hr: ({ ...props }: any) => (
    <Separator className="my-8" {...props} />
  ),
};

// Custom Link Component with PDF detection and external link handling
const CustomLink = ({ href, children, ...props }: any) => {
  const isExternal = href?.startsWith('http');
  const isPDF = href?.endsWith('.pdf');
  
  if (isPDF) {
    return (
      <PDFLink
        href={href}
        {...props}
      >
        {children}
      </PDFLink>
    );
  }
  
  if (isExternal) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary underline-offset-4 hover:underline inline-flex items-center"
        {...props}
      >
        {children}
        <ExternalLinkIcon className="ml-1 h-3 w-3" />
      </a>
    );
  }
  
  return (
    <Link 
      href={href} 
      className="text-primary underline-offset-4 hover:underline"
      {...props}
    >
      {children}
    </Link>
  );
};

// Optimized Image Component
const OptimizedImage = ({ src, alt, ...props }: any) => {
  return (
    <div className="my-6">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        className="rounded-lg border"
        {...props}
      />
      {alt && (
        <p className="text-sm text-muted-foreground text-center mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  );
};

// Enhanced Table Component
const DataTable = ({ children, ...props }: any) => (
  <div className="my-6 w-full overflow-y-auto">
    <Table {...props}>
      {children}
    </Table>
  </div>
);

// Default MDX components with shadcn/ui integration
export const defaultComponents = {
  // Typography
  ...TypographyComponents,
  
  // Links and media
  a: CustomLink,
  img: OptimizedImage,
  
  // Code
  code: ({ children, className, ...props }: any) => {
    // Inline code
    if (!className) {
      return (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props}>
          {children}
        </code>
      );
    }
    
    // Extract language from className
    const language = className?.replace('language-', '');
    
    // Check if this is a Mermaid diagram
    const isMermaid = language === 'mermaid' || (typeof children === 'string' && isMermaidCode(children, language));
    

    
    if (isMermaid) {
      return (
        <SimpleMermaid 
          code={children}
        />
      );
    }
    
    // Block code
    return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
  },
  pre: ({ children, ...props }: any) => {
    // Check if this is a code block that should be handled by CodeBlock component
    if (children?.props?.className) {
      const language = children.props.className?.replace('language-', '');
      const code = children.props.children;
      
      // Check if this is a Mermaid diagram
      const isMermaid = language === 'mermaid' || (typeof code === 'string' && isMermaidCode(code, language));
      

      if (isMermaid) {
        return (
          <SimpleMermaid 
            code={code}
          />
        );
      }
      
      return <CodeBlock {...children.props}>{children.props.children}</CodeBlock>;
    }
    
    return children; // Let code component handle pre
  },
  
  // Tables
  table: DataTable,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  
  // shadcn/ui components
  Alert: ({ children, variant = "default", ...props }: any) => (
    <Alert variant={variant} className="my-6" {...props}>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  ),
  
  Card: ({ children, ...props }: any) => (
    <Card className="my-6" {...props}>
      {children}
    </Card>
  ),
  
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  
  Badge: ({ children, variant = "default", ...props }: any) => (
    <Badge variant={variant} {...props}>
      {children}
    </Badge>
  ),
  
  Tabs: ({ children, ...props }: any) => (
    <Tabs className="my-6" {...props}>
      {children}
    </Tabs>
  ),
  
  TabsList,
  TabsTrigger,
  TabsContent,
  
  Button: ({ children, variant = "default", ...props }: any) => (
    <Button variant={variant} {...props}>
      {children}
    </Button>
  ),
  
  // PDF Viewer component
  PDFLink,
};