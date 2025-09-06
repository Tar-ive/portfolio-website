'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  retryCount: number
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  showDetails?: boolean
  maxRetries?: number
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  context?: string // e.g., "blog", "projects", "media"
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      retryCount: 0
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Report to error monitoring service (if configured)
    if (typeof window !== 'undefined') {
      // You can integrate with services like Sentry here
      // captureException(error, { extra: errorInfo })
    }
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onRetry={this.handleRetry}
        canRetry={this.state.retryCount < (this.props.maxRetries || 3)}
        showDetails={this.props.showDetails}
        context={this.props.context}
        retryCount={this.state.retryCount}
      />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  errorInfo?: ErrorInfo
  onRetry: () => void
  canRetry: boolean
  showDetails?: boolean
  context?: string
  retryCount: number
}

function ErrorFallback({ 
  error, 
  errorInfo, 
  onRetry, 
  canRetry, 
  showDetails = false,
  context,
  retryCount 
}: ErrorFallbackProps) {
  const getErrorMessage = () => {
    if (!error) return 'An unexpected error occurred'
    
    // Handle specific error types
    if (error.message.includes('rate limit')) {
      return 'Service is temporarily busy. Please try again in a few moments.'
    }
    
    if (error.message.includes('Network')) {
      return 'Network connection issue. Please check your internet connection.'
    }
    
    if (error.message.includes('not found')) {
      return 'The requested content could not be found.'
    }
    
    if (error.message.includes('Unauthorized')) {
      return 'Authentication issue. Please refresh the page.'
    }
    
    return error.message || 'Something went wrong'
  }

  const getContextualSuggestions = () => {
    switch (context) {
      case 'blog':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This might be due to:
            </p>
            <ul className="text-sm text-muted-foreground list-disc ml-4 space-y-1">
              <li>Notion API rate limiting (temporary)</li>
              <li>Network connectivity issues</li>
              <li>Blog content being updated</li>
            </ul>
          </div>
        )
      case 'media':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Media loading failed. This could be due to:
            </p>
            <ul className="text-sm text-muted-foreground list-disc ml-4 space-y-1">
              <li>Cloudinary service issues</li>
              <li>Image optimization problems</li>
              <li>Network connectivity</li>
            </ul>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">
              {context ? `${context.charAt(0).toUpperCase() + context.slice(1)} Error` : 'Error'}
            </CardTitle>
          </div>
          <CardDescription>
            {getErrorMessage()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {getContextualSuggestions()}
          
          {retryCount > 0 && (
            <Alert>
              <AlertDescription>
                Attempted to recover {retryCount} time{retryCount !== 1 ? 's' : ''}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            {canRetry && (
              <Button 
                onClick={onRetry} 
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
          
          {showDetails && process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium mb-2">
                Technical Details (Development Only)
              </summary>
              <div className="bg-muted p-3 rounded-md">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  <strong>Error:</strong> {error.name}: {error.message}
                  {'\n\n'}
                  <strong>Stack:</strong>{'\n'}{error.stack}
                  {errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>{'\n'}{errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Specialized error boundaries for different contexts
export function BlogErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="blog"
      showDetails={process.env.NODE_ENV === 'development'}
      maxRetries={2}
      onError={(error) => {
        console.error('Blog error:', error)
        // Could integrate with analytics here
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export function MediaErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="media"
      showDetails={false}
      maxRetries={1}
    >
      {children}
    </ErrorBoundary>
  )
}

export function ProjectErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="projects"
      showDetails={process.env.NODE_ENV === 'development'}
      maxRetries={2}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary