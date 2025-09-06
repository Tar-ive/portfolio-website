import { getBlogPost } from "@/lib/notion"
import { getBlogPostWithFallback } from "@/lib/blog-fallback"
import { notFound } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, WifiOff, Wifi } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Suspense } from "react"
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

async function BlogPostContent({ slug }: { slug: string }) {
  try {
    console.log(`Fetching blog post with slug: ${slug}`)
    const post = await getBlogPostWithFallback(slug, getBlogPost)
    
    const isUsingFallback = post.id.startsWith('fallback-')

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
  } catch (error) {
    console.error("Error in BlogPostContent:", error)

    if (error instanceof Error && error.message.includes("Post not found")) {
      notFound()
    }

    // This should rarely happen now due to fallback system
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Content Unavailable</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load blog post"}
          {process.env.NODE_ENV === "development" && error instanceof Error && (
            <div className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{error.stack}</div>
          )}
        </AlertDescription>
      </Alert>
    )
  }
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <BlogErrorBoundary>
      <div className="container mx-auto px-4 py-12 bg-white">
        <Suspense fallback={<LoadingPost />}>
          <BlogPostContent slug={params.slug} />
        </Suspense>
      </div>
    </BlogErrorBoundary>
  )
}

