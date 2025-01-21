import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { getBlogPosts } from "@/lib/notion"
import { Suspense } from "react"

export const revalidate = 3600 // Revalidate every hour

function LoadingPosts() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-2/3 bg-muted rounded"></div>
            <div className="h-4 w-1/3 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-full bg-muted rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function BlogPosts() {
  try {
    console.log("Fetching blog posts...")
    const posts = await getBlogPosts()
    console.log("Fetched blog posts:", JSON.stringify(posts, null, 2))

    if (posts.length === 0) {
      return (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-3">
              <p className="text-muted-foreground">No posts found. Make sure your Notion database:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Has the correct structure (Page, Description, published, Date, Slug, Author)</li>
                <li>Contains published posts</li>
                <li>Is shared with your integration</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{new Date(post.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.description}</p>
                <p className="text-sm text-muted-foreground mt-2">Author: {post.author}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )
  } catch (error: unknown) {
    console.error("Error in BlogPosts:", error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load blog posts"}
          {process.env.NODE_ENV === "development" && error instanceof Error && (
            <div className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{error.stack}</div>
          )}
        </AlertDescription>
      </Alert>
    )
  }
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <Suspense fallback={<LoadingPosts />}>
        <BlogPosts />
      </Suspense>
    </div>
  )
}

