'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ZoomInIcon, 
  ZoomOutIcon, 
  RotateCcwIcon, 
  MaximizeIcon,
  AlertTriangleIcon,
  CopyIcon,
  CheckIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MermaidRendererProps } from '@/lib/types';
import mermaid from 'mermaid';

export default function MermaidRenderer({
  code,
  className,
  theme = 'default',
  zoomable = true,
  pannable = true,
  maxZoom = 3,
  minZoom = 0.5,
}: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mermaidId] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const { theme: systemTheme } = useTheme();

  // Determine the effective theme
  const effectiveTheme = theme === 'default' 
    ? (systemTheme === 'dark' ? 'dark' : 'default')
    : theme;

  // Initialize mermaid on component mount
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: effectiveTheme,
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      themeVariables: {
        primaryColor: effectiveTheme === 'dark' ? '#3b82f6' : '#2563eb',
        primaryTextColor: effectiveTheme === 'dark' ? '#f8fafc' : '#1e293b',
        primaryBorderColor: effectiveTheme === 'dark' ? '#475569' : '#cbd5e1',
        lineColor: effectiveTheme === 'dark' ? '#64748b' : '#475569',
        secondaryColor: effectiveTheme === 'dark' ? '#1e293b' : '#f1f5f9',
        tertiaryColor: effectiveTheme === 'dark' ? '#0f172a' : '#ffffff',
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
      },
      sequence: {
        useMaxWidth: false,
      },
      gantt: {
        useMaxWidth: false,
      },
    });
  }, [effectiveTheme]);

  const renderDiagram = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Validate and render the diagram
      const isValid = await mermaid.parse(code);
      if (!isValid) {
        throw new Error('Invalid Mermaid syntax');
      }

      const { svg } = await mermaid.render(mermaidId, code);
      
      console.log('Mermaid SVG generated:', svg.substring(0, 200) + '...');
      
      // Clear container and insert SVG
      containerRef.current.innerHTML = svg;
      
      // Get reference to the SVG element
      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        svgRef.current = svgElement;
        
        console.log('SVG element found:', svgElement);
        console.log('SVG dimensions:', svgElement.getBoundingClientRect());
        
        // Set up responsive sizing
        svgElement.style.maxWidth = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.display = 'block';
        svgElement.style.position = 'relative';
        svgElement.style.top = '0';
        svgElement.style.left = '0';
        
        // Add accessibility attributes
        svgElement.setAttribute('role', 'img');
        svgElement.setAttribute('aria-label', 'Mermaid diagram');
        
        // Apply zoom and pan if enabled
        if (zoomable || pannable) {
          setupInteractivity(svgElement);
        }
      } else {
        console.error('SVG element not found in container');
      }

    } catch (err) {
      console.error('Mermaid rendering error:', err);
      setError(err instanceof Error ? err.message : 'Failed to render diagram');
    } finally {
      setIsLoading(false);
    }
  }, [code, mermaidId, zoomable, pannable]);

  const setupInteractivity = (svgElement: SVGElement) => {
    // Apply current transform
    updateTransform(svgElement);
    
    // Add mouse wheel zoom support
    if (zoomable) {
      svgElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    // Add pan support
    if (pannable) {
      svgElement.addEventListener('mousedown', handleMouseDown);
      svgElement.style.cursor = 'grab';
    }
  };

  const updateTransform = (svgElement: SVGElement) => {
    const transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
    svgElement.style.transform = transform;
    svgElement.style.transformOrigin = 'center center';
  };

  const handleWheel = (e: WheelEvent) => {
    if (!zoomable) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
    setZoom(newZoom);
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!pannable) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    
    if (svgRef.current) {
      svgRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !pannable) return;
    
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart, pannable]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (svgRef.current) {
      svgRef.current.style.cursor = 'grab';
    }
  }, []);

  // Set up global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update transform when zoom or pan changes
  useEffect(() => {
    if (svgRef.current) {
      updateTransform(svgRef.current);
    }
  }, [zoom, pan]);

  // Render diagram when code or theme changes
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  const handleZoomIn = () => {
    if (zoom < maxZoom) {
      setZoom(Math.min(maxZoom, zoom + 0.2));
    }
  };

  const handleZoomOut = () => {
    if (zoom > minZoom) {
      setZoom(Math.max(minZoom, zoom - 0.2));
    }
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (error) {
    return (
      <Card className="my-6 p-4">
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Failed to render Mermaid diagram</p>
              <p className="text-sm">{error}</p>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">mermaid</Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-6 w-6 p-0"
            >
              {copied ? (
                <CheckIcon className="h-3 w-3" />
              ) : (
                <CopyIcon className="h-3 w-3" />
              )}
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-lg border bg-muted px-4 py-4 text-sm">
            <code>{code}</code>
          </pre>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("my-6 overflow-hidden", className)}>
      {/* Controls */}
      {(zoomable || pannable) && (
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">mermaid</Badge>
            <span className="text-xs text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {zoomable && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomOut}
                  disabled={zoom <= minZoom}
                  className="h-7 w-7 p-0"
                >
                  <ZoomOutIcon className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomIn}
                  disabled={zoom >= maxZoom}
                  className="h-7 w-7 p-0"
                >
                  <ZoomInIcon className="h-3 w-3" />
                </Button>
              </>
            )}
            
            {(zoomable || pannable) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleReset}
                className="h-7 w-7 p-0"
              >
                <RotateCcwIcon className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFullscreen}
              className="h-7 w-7 p-0"
            >
              <MaximizeIcon className="h-3 w-3" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-7 w-7 p-0"
            >
              {copied ? (
                <CheckIcon className="h-3 w-3" />
              ) : (
                <CopyIcon className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      )}
      
      {/* Diagram container */}
      <div className="relative">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              Rendering diagram...
            </span>
          </div>
        )}
        
        <div
          ref={containerRef}
          className={cn(
            "mermaid-container p-4 min-h-[200px]",
            isLoading && "opacity-0 flex items-center justify-center",
            !isLoading && "flex justify-center",
            (zoomable || pannable) && "overflow-hidden"
          )}
          style={{
            transition: isLoading ? 'none' : 'opacity 0.2s ease-in-out',
          }}
        />
      </div>
    </Card>
  );
}