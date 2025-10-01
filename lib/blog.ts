import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export type BlogFrontmatter = {
  title: string
  description?: string
  date: string
  author: string
  slug?: string
  published?: boolean
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  description: string
  date: string
  author: string
  content: string
}

const BLOG_DIRECTORY = path.join(process.cwd(), 'content', 'blog')

type LoadedBlogPost = BlogPost & { published: boolean }

async function loadBlogFile(fileName: string): Promise<LoadedBlogPost> {
  const filePath = path.join(BLOG_DIRECTORY, fileName)
  const source = await fs.readFile(filePath, 'utf8')
  const { data, content } = matter(source)
  const frontmatter = data as BlogFrontmatter

  const slug = (frontmatter.slug || fileName.replace(/\.mdx?$/, '')).trim()

  if (!frontmatter.title) {
    throw new Error(`Blog post "${fileName}" is missing a title in its frontmatter.`)
  }

  if (!frontmatter.date) {
    throw new Error(`Blog post "${fileName}" is missing a publication date in its frontmatter.`)
  }

  if (!frontmatter.author) {
    throw new Error(`Blog post "${fileName}" is missing an author in its frontmatter.`)
  }

  return {
    slug,
    id: slug,
    title: frontmatter.title,
    description: frontmatter.description ?? '',
    date: new Date(frontmatter.date).toISOString(),
    author: frontmatter.author,
    content,
    published: frontmatter.published !== false,
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(BLOG_DIRECTORY)
    const markdownFiles = files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))

    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const result = await loadBlogFile(file)
        return result
      })
    )

    return posts
      .filter((post) => post.published)
      .map(({ published: _published, ...post }) => post)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error: unknown) {
    console.error('Failed to load blog posts from local content directory.', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const files = await fs.readdir(BLOG_DIRECTORY)
    const markdownFile = files.find((file) => {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) {
        return false
      }

      const normalizedSlug = slug.trim().toLowerCase()
      const fileSlug = file.replace(/\.mdx?$/, '').trim().toLowerCase()

      if (fileSlug === normalizedSlug) {
        return true
      }

      try {
        const { data } = matter.read(path.join(BLOG_DIRECTORY, file))
        const frontmatter = data as BlogFrontmatter
        return frontmatter.slug?.trim().toLowerCase() === normalizedSlug
      } catch (readError) {
        console.warn(`Unable to inspect frontmatter for blog file ${file}:`, readError)
        return false
      }
    })

    if (!markdownFile) {
      return null
    }

    const post = await loadBlogFile(markdownFile)
    if (!post.published) {
      return null
    }

    const { published: _published, ...blogPost } = post
    return blogPost
  } catch (error: unknown) {
    console.error(`Failed to load blog post with slug "${slug}".`, error)
    return null
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts()
  return posts.map((post) => post.slug)
}
