'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  DownloadIcon, 
  ZoomInIcon, 
  ZoomOutIcon,
  FileTextIcon,
  AlertCircleIcon
} from 'lucide-react';
import { PDFViewerProps } from '@/lib/types';
import { cn } from '@/lib/utils';

// Import required CSS for annotations and text layer
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerState {
  numPages: number | null;
  currentPage: number;
  scale: number;
  loading: boolean;
  error: string | null;
}

export default function PDFViewer({
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
}: PDFViewerProps) {
  const [state, setState] = useState<PDFViewerState>({
    numPages: null,
    currentPage: initialPage,
    scale: 1.0,
    loading: true,
    error: null,
  });

  const [isSupported, setIsSupported] = useState(true);

  // Check PDF support on mount
  useEffect(() => {
    const checkSupport = () => {
      try {
        // Check if PDF.js is available and browser supports it
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        return !!(context && pdfjs);
      } catch {
        return false;
      }
    };

    setIsSupported(checkSupport());
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setState(prev => ({
      ...prev,
      numPages,
      loading: false,
      error: null,
    }));
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF loading error:', error);
    setState(prev => ({
      ...prev,
      loading: false,
      error: error.message || 'Failed to load PDF',
    }));
  }, []);

  const goToPrevPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1),
    }));
  }, []);

  const goToNextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: Math.min(prev.numPages || 1, prev.currentPage + 1),
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setState(prev => ({
      ...prev,
      scale: Math.min(3.0, prev.scale + 0.2),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      scale: Math.max(0.5, prev.scale - 0.2),
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setState(prev => ({
      ...prev,
      scale: 1.0,
    }));
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = src;
    link.download = title || 'document.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [src, title]);

  // Fallback for unsupported browsers or external view mode
  if (!isSupported || viewMode === 'external') {
    return (
      <Card className="my-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                {title || 'PDF Document'}
              </CardTitle>
            </div>
            <Badge variant="secondary">PDF</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircleIcon className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground max-w-md">
              {fallbackText}
            </p>
            <Button onClick={handleDownload} className="gap-2">
              <DownloadIcon className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (state.error) {
    return (
      <Card className="my-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                {title || 'PDF Document'}
              </CardTitle>
            </div>
            <Badge variant="destructive">Error</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              Failed to load PDF: {state.error}
            </AlertDescription>
          </Alert>
          {downloadable && (
            <div className="mt-4 flex justify-center">
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <DownloadIcon className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">
              {title || 'PDF Document'}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">PDF</Badge>
            {state.numPages && (
              <Badge variant="outline">
                {state.numPages} page{state.numPages !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {showToolbar && (
        <>
          <Separator />
          <div className="px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={state.currentPage <= 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                  {state.numPages ? (
                    <>Page {state.currentPage} of {state.numPages}</>
                  ) : (
                    'Loading...'
                  )}
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

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={zoomOut}
                  disabled={state.scale <= 0.5}
                >
                  <ZoomOutIcon className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetZoom}
                  className="min-w-[60px]"
                >
                  {Math.round(state.scale * 100)}%
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={zoomIn}
                  disabled={state.scale >= 3.0}
                >
                  <ZoomInIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Download Button */}
              {downloadable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      <CardContent className="p-0">
        <div 
          className="flex justify-center bg-muted/30 overflow-auto"
          style={{ 
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
          }}
        >
          {state.loading && (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}
          
          <Document
            file={src}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            error=""
            className={cn(
              "flex justify-center items-start p-4",
              state.loading && "hidden"
            )}
          >
            <Page
              pageNumber={state.currentPage}
              scale={state.scale}
              className="shadow-lg"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </CardContent>
    </Card>
  );
}