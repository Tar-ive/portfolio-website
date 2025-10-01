import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Suspense } from "react"
import { BlogErrorBoundary } from "@/components/error-boundary"
import { getBlogPosts } from "@/lib/blog"

export const revalidate = 1800 // Revalidate every 30 minutes

function LoadingPosts() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-2/3 bg-muted rounded" />
            <div className="h-4 w-1/3 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-4 w-full bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function BlogPosts() {
  const posts = await getBlogPosts()

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">
              No posts found yet. Add a Markdown file to <code>content/blog</code> and push to GitHub to publish your first article.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
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
    </div>
  )
}

export default function BlogPage() {
  return (
    <BlogErrorBoundary>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <Suspense fallback={<LoadingPosts />}>
          <BlogPosts />
        </Suspense>
      </div>
    </BlogErrorBoundary>
  )
}
