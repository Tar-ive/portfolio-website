'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react';

const PDFViewer = dynamic(() => import('./pdf-viewer'), {
  ssr: false,
  loading: () => (
    <div className="my-6 p-8 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading PDF viewer...</span>
      </div>
    </div>
  ),
});

interface PDFLinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}

export default function PDFLink({ href, children, ...props }: PDFLinkProps) {
  return (
    <PDFViewer
      src={href}
      title={typeof children === 'string' ? children : 'PDF Document'}
      embedded={true}
      downloadable={true}
      showToolbar={true}
      viewMode="inline"
      {...props}
    />
  );
}