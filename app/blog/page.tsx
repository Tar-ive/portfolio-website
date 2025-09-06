import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"
import { getBlogPosts } from "@/lib/notion"
import { getBlogPostsWithFallback } from "@/lib/blog-fallback"
import { BlogErrorBoundary } from "@/components/error-boundary"
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
  console.log("Fetching blog posts with fallback support...")
  
  const posts = await getBlogPostsWithFallback(() => getBlogPosts())
  console.log(`Fetched ${posts.length} blog posts`)

  // Check if we're using fallback posts
  const isUsingFallback = posts.some(post => post.id.startsWith('fallback-'))

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-3">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
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
    <div className="space-y-6">
      {isUsingFallback && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <WifiOff className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Offline Mode Active
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            Content management system is temporarily unavailable. Showing cached content and offline posts.
            The system will automatically restore normal functionality once connectivity is reestablished.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="hover:bg-muted/50 transition-colors relative">
              {post.id.startsWith('fallback-') && (
                <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  Offline
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {post.title}
                  {!post.id.startsWith('fallback-') && (
                    <Wifi className="h-4 w-4 text-green-500" />
                  )}
                </CardTitle>
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

