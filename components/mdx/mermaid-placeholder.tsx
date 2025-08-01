import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Dynamically import the client-side Mermaid renderer
const MermaidRenderer = dynamic(() => import('./mermaid'), {
  ssr: false,
  loading: () => (
    <Card className="my-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary">mermaid</Badge>
        <div className="text-sm text-muted-foreground">Loading diagram...</div>
      </div>
      <div className="flex items-center justify-center p-8 min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </Card>
  ),
});

interface MermaidPlaceholderProps {
  code: string;
}

export default function MermaidPlaceholder({ code }: MermaidPlaceholderProps) {
  return (
    <Suspense fallback={
      <Card className="my-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">mermaid</Badge>
          <div className="text-sm text-muted-foreground">Loading diagram...</div>
        </div>
        <div className="flex items-center justify-center p-8 min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    }>
      <MermaidRenderer code={code} />
    </Suspense>
  );
}