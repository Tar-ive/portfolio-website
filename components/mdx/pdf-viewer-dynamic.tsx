'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  DownloadIcon, 
  ZoomInIcon, 
  ZoomOutIcon,
  FileTextIcon,
  AlertCircleIcon,
  LoaderIcon
} from 'lucide-react';
import { PDFViewerProps } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PDFViewerState {
  numPages: number | null;
  currentPage: number;
  scale: number;
  loading: boolean;
  error: string | null;
}

export default function PDFViewerDynamic(props: PDFViewerProps) {
  const [PDFComponents, setPDFComponents] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic import of react-pdf components
    const loadPDFComponents = async () => {
      try {
        const [pdfModule, pdfjsDist] = await Promise.all([
          import('react-pdf'),
          import('pdfjs-dist')
        ]);

        // Configure PDF.js worker
        const pdfjs = pdfjsDist.default || pdfjsDist;
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        setPDFComponents({
          Document: pdfModule.Document,
          Page: pdfModule.Page,
          pdfjs: pdfjs
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load PDF components:', err);
        setError('Failed to load PDF viewer');
        setIsLoading(false);
      }
    };

    loadPDFComponents();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <LoaderIcon className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading PDF viewer...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !PDFComponents) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Alert>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              {error || 'PDF viewer unavailable'}. 
              {props.src && (
                <a 
                  href={props.src} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Download PDF instead
                </a>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Import the full PDF viewer component with the loaded components
  return <PDFViewerInternal PDFComponents={PDFComponents} {...props} />;
}

// Internal component that uses the dynamically loaded PDF components
function PDFViewerInternal({ PDFComponents, ...props }: PDFViewerProps & { PDFComponents: any }) {
  const { Document, Page } = PDFComponents;
  const {
    src,
    title,
    width = '100%',
    height = 600,
    embedded = true,
    downloadable = true,
    viewMode = 'inline',
    showToolbar = true,
    initialPage = 1,
    fallbackText = 'PDF viewing not supported in your browser. Click to download.'
  } = props;

  const [state, setState] = useState<PDFViewerState>({
    numPages: null,
    currentPage: initialPage,
    scale: 1.0,
    loading: true,
    error: null,
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setState(prev => ({ 
      ...prev, 
      numPages, 
      loading: false,
      error: null 
    }));
  };

  const onDocumentLoadError = (error: Error) => {
    setState(prev => ({ 
      ...prev, 
      loading: false, 
      error: error.message 
    }));
  };

  const goToPrevPage = () => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1)
    }));
  };

  const goToNextPage = () => {
    setState(prev => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.numPages || 1)
    }));
  };

  const zoomIn = () => {
    setState(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.2, 3.0)
    }));
  };

  const zoomOut = () => {
    setState(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.2, 0.4)
    }));
  };

  if (state.error) {
    return (
      <Alert>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          Error loading PDF: {state.error}
          {downloadable && src && (
            <a 
              href={src} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:underline"
            >
              Download instead
            </a>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {showToolbar && (
          <div className="flex items-center justify-between p-3 border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={state.currentPage <= 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium">
                {state.currentPage} / {state.numPages || '?'}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={state.currentPage >= (state.numPages || 1)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={state.scale <= 0.4}
              >
                <ZoomOutIcon className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium">
                {Math.round(state.scale * 100)}%
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={state.scale >= 3.0}
              >
                <ZoomInIcon className="h-4 w-4" />
              </Button>

              {downloadable && src && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={src} target="_blank" rel="noopener noreferrer">
                    <DownloadIcon className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        <div 
          className="overflow-auto bg-muted/20 flex justify-center"
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
        >
          <Document
            file={src}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center py-8">
                <LoaderIcon className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading PDF...</span>
              </div>
            }
            error={
              <Alert className="m-4">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  {fallbackText}
                  {downloadable && src && (
                    <a 
                      href={src} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      Download PDF
                    </a>
                  )}
                </AlertDescription>
              </Alert>
            }
          >
            <Page
              pageNumber={state.currentPage}
              scale={state.scale}
              width={typeof width === 'number' ? width : undefined}
            />
          </Document>
        </div>
      </CardContent>
    </Card>
  );
}