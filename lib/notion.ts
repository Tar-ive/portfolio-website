import { Client, LogLevel, APIErrorCode, isNotionClientError, ClientErrorCode } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import { cache } from "react"
import fetch from "node-fetch-native"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

// Check if we're in build mode or if environment variables are missing
const isProduction = process.env.NODE_ENV === 'production'
const hasRequiredEnv = process.env.NOTION_TOKEN && process.env.BLOG_INDEX_ID

let notion: Client | null = null
let n2m: NotionToMarkdown | null = null

// Only initialize if we have the required environment variables
if (hasRequiredEnv) {
  try {
    notion = new Client({
      auth: process.env.NOTION_TOKEN,
      logLevel: LogLevel.DEBUG,
      fetch: fetch as any, // Type assertion needed for compatibility
    })
    n2m = new NotionToMarkdown({ notionClient: notion })
  } catch (error) {
    console.error("Failed to initialize Notion client:", error)
    if (isProduction) {
      throw new Error("Failed to initialize Notion client. Please check your NOTION_TOKEN.")
    }
  }
}

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim()
}

interface NotionPage {
  id: string
  properties: {
    Page?: { title: Array<{ plain_text: string }> }
    Description?: { rich_text: Array<{ plain_text: string }> }
    published?: { checkbox: boolean }
    Date?: { date: { start: string } }
    Slug?: { rich_text: Array<{ plain_text: string }> }
    Author?: { people: Array<{ name: string }> }
  }
}

// Mock data for demonstration when Notion API is not available
const mockBlogPosts = [
  {
    id: "demo-1",
    title: "Welcome to My Blog",
    description: "This is a demo blog post showcasing the enhanced Notion-powered blog functionality with rich text rendering, improved UI components, and seamless integration.",
    date: new Date().toISOString(),
    slug: "welcome-to-my-blog",
    author: "Saksham Adhikari",
    published: true,
    content: "# Welcome to My Blog\n\nThis is a **demo blog post** to showcase the enhanced blog functionality.\n\n## Features\n\n- Enhanced Notion content rendering\n- Beautiful blog post cards\n- Rich text support with formatting\n- Improved error handling\n\n## Code Example\n\n```javascript\nconst blog = {\n  title: 'Amazing Blog',\n  powered: 'Notion API'\n}\n```\n\n> This is a quote block to demonstrate rich formatting capabilities.\n\nThe blog now supports proper Notion block rendering for a much better reading experience!"
  },
  {
    id: "demo-2", 
    title: "Enhanced Blog Architecture",
    description: "Deep dive into the technical improvements made to the blog system, including NotionRenderer integration, better error handling, and component architecture.",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    slug: "enhanced-blog-architecture",
    author: "Saksham Adhikari", 
    published: true,
    content: "# Enhanced Blog Architecture\n\nThis post covers the technical improvements made to enhance the blog functionality.\n\n## Key Improvements\n\n1. **NotionRenderer Integration**\n   - Custom block-by-block rendering\n   - Better typography and spacing\n   - Rich text formatting support\n\n2. **Enhanced UI Components**\n   - BlogPostCard with hover effects\n   - Better error boundaries\n   - Loading states\n\n3. **Improved Error Handling**\n   - Graceful degradation\n   - Helpful error messages\n   - Development vs production modes\n\n## Architecture Benefits\n\n- Better performance through caching\n- Enhanced user experience\n- Maintainable codebase\n- Future-proof design\n\nThe new architecture provides a solid foundation for scaling the blog functionality."
  }
]

export const getBlogPosts = cache(async () => {
  console.log("Starting getBlogPosts...")

  if (!process.env.NOTION_TOKEN || !process.env.BLOG_INDEX_ID) {
    console.log("Missing environment variables, returning mock data for demo")
    return mockBlogPosts
  }

  if (!notion || !n2m) {
    console.log("Notion client not initialized, returning mock data for demo")
    return mockBlogPosts
  }

  try {
    console.log("Querying Notion database...")
    const response = await notion.databases.query({
      database_id: process.env.BLOG_INDEX_ID,
      filter: {
        property: "published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    })

    console.log(`Found ${response.results.length} published posts`)

    const posts = await Promise.all(
      response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(async (page) => {
          try {
            console.log(`Processing page: ${page.id}`)
            const pageContent = await notion.blocks.children.list({
              block_id: page.id,
            })

            const title = page.properties.Page?.title?.[0]?.plain_text || "Untitled"
            const providedSlug = page.properties.Slug?.rich_text?.[0]?.plain_text
            const slug = providedSlug ? createSlug(providedSlug) : createSlug(title)

            const description = page.properties.Description?.rich_text?.[0]?.plain_text || ""
            const date = page.properties.Date?.date?.start || new Date().toISOString()
            const author = page.properties.Author?.people?.[0]?.name || "Anonymous"
            const published = page.properties.published?.checkbox || false

            console.log(`Converting blocks to markdown for page: ${page.id}`)
            const mdBlocks = await n2m.blocksToMarkdown(pageContent.results)
            const { parent: content } = n2m.toMarkdownString(mdBlocks)

            console.log(`Processed post: ${title} with slug: ${slug}`)
            console.log(`Content preview: ${content.substring(0, 100)}...`)
            console.log(`Full content object:`, JSON.stringify(n2m.toMarkdownString(mdBlocks), null, 2))

            return {
              id: page.id,
              title,
              description,
              date,
              slug,
              author,
              published,
              content,
              fullContentObject: n2m.toMarkdownString(mdBlocks), // Including full content object for debugging
            }
          } catch (error) {
            console.error(`Error processing page ${page.id}:`, error)
            return null
          }
        }),
    )

    return posts.filter((post): post is NonNullable<typeof post> => post !== null)
  } catch (error: unknown) {
    console.error("Detailed error in getBlogPosts:", error)
    console.log("Falling back to mock data for demo purposes")

    // In development or when API fails, return mock data
    if (process.env.NODE_ENV === 'development' || !hasRequiredEnv) {
      return mockBlogPosts
    }

    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          throw new Error("Request to Notion API timed out")
        case APIErrorCode.ObjectNotFound:
          throw new Error("Notion database not found. Please check your BLOG_INDEX_ID")
        case APIErrorCode.Unauthorized:
          throw new Error("Unauthorized access to Notion API. Please check your NOTION_TOKEN")
        default:
          throw new Error(`Notion API Error: ${error.code} - ${error.message}`)
      }
    }

    if (error instanceof Error) {
      console.error("Error stack:", error.stack)
    }

    throw new Error(
      `An unexpected error occurred while fetching blog posts: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
})

export const getBlogPost = cache(async (slug: string) => {
  console.log("Starting getBlogPost for slug:", slug)

  if (!slug) {
    throw new Error("Slug is required")
  }

  try {
    const posts = await getBlogPosts()
    const cleanSlug = createSlug(slug)
    console.log("Looking for post with slug:", cleanSlug)

    const post = posts.find((p) => p.slug === cleanSlug)

    if (!post) {
      console.log(
        "Available slugs:",
        posts.map((p) => p.slug),
      )
      throw new Error(`Post not found: ${cleanSlug}`)
    }

    console.log("Found post:", post.title)
    
    // For mock posts, create some demo blocks
    if (post.id.startsWith('demo-')) {
      const mockBlocks = [
        {
          id: 'block-1',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                plain_text: 'This is a demo blog post with enhanced rendering capabilities.',
                annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false }
              }
            ]
          }
        },
        {
          id: 'block-2', 
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                plain_text: 'Enhanced Features',
                annotations: { bold: true, italic: false, strikethrough: false, underline: false, code: false }
              }
            ]
          }
        },
        {
          id: 'block-3',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                plain_text: 'Beautiful NotionRenderer for rich content',
                annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false }
              }
            ]
          }
        }
      ]
      
      return {
        ...post,
        blocks: mockBlocks
      }
    }

    // For real Notion posts, get the actual page content blocks
    if (!notion) {
      return post // Fallback to markdown content only
    }

    const pageContentResponse = await notion.blocks.children.list({
      block_id: post.id,
      page_size: 100
    })

    return {
      ...post,
      blocks: pageContentResponse.results
    }
  } catch (error: unknown) {
    console.error("Detailed error in getBlogPost:", error)

    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          throw new Error("Request to Notion API timed out")
        case APIErrorCode.ObjectNotFound:
          throw new Error("Notion page not found. Please check the post ID")
        case APIErrorCode.Unauthorized:
          throw new Error("Unauthorized access to Notion API. Please check your NOTION_TOKEN")
        default:
          throw new Error(`Notion API Error: ${error.code} - ${error.message}`)
      }
    }

    throw new Error(
      `An unexpected error occurred while fetching the blog post: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
})
