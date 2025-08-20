import { getBlogPost } from "@/lib/notion"
import { notFound } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Suspense } from "react"
import { mdxComponents } from "@/components/mdx-component"
import { NotionRenderer } from "@/components/notion"

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
    const post = await getBlogPost(slug)

    return (
      <article className="prose prose-slate max-w-none dark:prose-invert prose-pre:p-0 prose-pre:bg-transparent">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          {new Date(post.date).toLocaleDateString()} | By {post.author}
        </div>
        
        {/* Use NotionRenderer for better block rendering if blocks are available */}
        {post.blocks && post.blocks.length > 0 ? (
          <NotionRenderer blocks={post.blocks} />
        ) : (
          <ReactMarkdown components={mdxComponents}>{post.content}</ReactMarkdown>
        )}
      </article>
    )
  } catch (error) {
    console.error("Error in BlogPostContent:", error)

    if (error instanceof Error && error.message.includes("Post not found")) {
      notFound()
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load blog post"}
          {process.env.NODE_ENV === "development" && error instanceof Error && (
            <div className="mt-2 text-xs opacity-70">{error.stack}</div>
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
    <div className="container mx-auto px-4 py-12 bg-white">
      <Suspense fallback={<LoadingPost />}>
        <BlogPostContent slug={params.slug} />
      </Suspense>
    </div>
  )
}

