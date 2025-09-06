import { getBlogPost } from "@/lib/notion"
import { getBlogPostWithFallback } from "@/lib/blog-fallback"
import { notFound } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, WifiOff, Wifi } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { mdxComponents } from "@/components/mdx-component"
import { BlogErrorBoundary } from "@/components/error-boundary"

export const revalidate = 3600 // Revalidate every hour

function LoadingPost() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-2/3 bg-muted rounded"></div>
      <div className="h-4 w-1/3 bg-muted rounded"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-2/3 bg-muted rounded"></div>
      </div>
    </div>
  )
}

// Timeout wrapper to prevent hanging - Updated based on 2024 research
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Blog post fetch timed out after ${timeoutMs/1000}s. This may indicate Notion API issues or large dataset handling delays.`)), timeoutMs)
  })
  
  return Promise.race([promise, timeoutPromise])
}

async function BlogPostContent({ slug }: { slug: string }) {
  console.log(`BlogPostContent: Starting fetch for slug: ${slug}`)
  
  let post;
  try {
    console.log(`BlogPostContent: Calling getBlogPostWithFallback for slug: ${slug}`)
    
    // Add 60 second timeout for production reliability (based on GitHub research)
    post = await withTimeout(
      getBlogPostWithFallback(slug, getBlogPost),
      60000
    )
    
    console.log(`BlogPostContent: Successfully got post:`, post?.id, post?.title)
    
    if (!post) {
      console.error(`BlogPostContent: Post is null/undefined for slug: ${slug}`)
      throw new Error(`Post not found: ${slug}`)
    }
    
  } catch (error) {
    console.error(`BlogPostContent: Error in getBlogPostWithFallback for ${slug}:`, error)
    
    // Force fallback if primary fetch fails
    post = {
      id: `emergency-fallback-${slug}`,
      title: 'Content Temporarily Unavailable',
      description: 'This content is temporarily unavailable due to technical issues.',
      date: new Date().toISOString(),
      slug,
      author: 'Saksham Adhikari',
      published: true,
      content: `# Content Temporarily Unavailable

The blog post you're looking for is temporarily unavailable due to technical issues with our content management system.

**What happened?** We encountered an unexpected error while trying to load this content.

## What You Can Do

- **Try Refreshing**: The issue may resolve quickly
- **Check Back Later**: Most issues are resolved within minutes  
- **Browse Other Content**: Check out my [projects](/projects) or [homepage](/)
- **Contact Me**: If this persists, feel free to reach out

This is likely a temporary issue and the content will be restored automatically once the problem is resolved.

Thank you for your patience!`,
      fullContentObject: null,
    }
  }
  
  const isUsingFallback = post.id.startsWith('fallback-') || post.id.startsWith('emergency-fallback-')
  console.log(`BlogPostContent: Rendering post with fallback status: ${isUsingFallback}`)

  return (
      <article className="prose prose-slate max-w-none dark:prose-invert prose-pre:p-0 prose-pre:bg-transparent">
        {isUsingFallback && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 mb-6">
            <WifiOff className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">
              Offline Content
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              You're viewing offline content. The content management system is temporarily unavailable.
              Normal connectivity will be restored automatically.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {isUsingFallback ? (
            <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
              Offline
            </div>
          ) : (
            <Wifi className="h-4 w-4 text-green-500" aria-label="Live content" />
          )}
        </div>
        
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          {new Date(post.date).toLocaleDateString()} | By {post.author}
        </div>
        
        <ReactMarkdown components={mdxComponents}>{post.content}</ReactMarkdown>
      </article>
    )
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <BlogErrorBoundary>
      <div className="container mx-auto px-4 py-12 bg-white">
        <BlogPostContent slug={params.slug} />
      </div>
    </BlogErrorBoundary>
  )
}

