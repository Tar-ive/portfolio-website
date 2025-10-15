"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DownloadIcon, ExternalLinkIcon, FileTextIcon } from "lucide-react"
import type { PDFViewerProps } from "@/lib/types"

function Toolbar({ src, downloadable }: { src: string; downloadable: boolean }) {
  if (!downloadable && !src) {
    return null
  }

  return (
    <div className="flex items-center justify-end gap-2 border-b bg-muted/50 px-3 py-2">
      {src && (
        <Button variant="outline" size="sm" asChild>
          <a href={src} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon className="mr-2 h-4 w-4" />
            Open
          </a>
        </Button>
      )}
      {downloadable && src && (
        <Button variant="outline" size="sm" asChild>
          <a href={src} download>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      )}
    </div>
  )
}

export default function PDFViewer({
  src,
  title,
  height = 600,
  downloadable = true,
  viewMode = "inline",
  showToolbar = true,
  fallbackText = "PDF preview unavailable. Use the download button instead.",
}: PDFViewerProps) {
  if (!src) {
    return (
      <Alert>
        <AlertDescription>No PDF source provided.</AlertDescription>
      </Alert>
    )
  }

  if (viewMode === "external") {
    return (
      <Card className="w-full">
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            {fallbackText}
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <a href={src} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                Open PDF
              </a>
            </Button>
            {downloadable && (
              <Button variant="outline" asChild>
                <a href={src} download>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden">
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      {showToolbar && <Toolbar src={src} downloadable={downloadable} />}
      <CardContent className="p-0">
        <div className="relative w-full overflow-hidden bg-muted/20">
          <iframe
            src={`${src}#toolbar=0&navpanes=0`}
            title={title ?? "PDF preview"}
            className="h-full w-full border-0"
            style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
