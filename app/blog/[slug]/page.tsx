import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { mdxComponents } from "@/components/mdx-component"
import { BlogErrorBoundary } from "@/components/error-boundary"
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog"

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="prose prose-slate max-w-none dark:prose-invert prose-pre:p-0 prose-pre:bg-transparent">
      <h1 className="text-3xl font-bold">{post.title}</h1>
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

export const dynamicParams = true
