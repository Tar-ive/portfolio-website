import { Client, LogLevel, APIErrorCode, isNotionClientError, ClientErrorCode } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import { cache } from "react"
import fetch from "node-fetch-native"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

// Environment configuration check
const isNotionConfigured = !!(process.env.NOTION_TOKEN && process.env.BLOG_INDEX_ID)

let notion: Client | null = null
let n2m: NotionToMarkdown | null = null

// Only initialize Notion client if environment variables are available
if (isNotionConfigured) {
  try {
    notion = new Client({
      auth: process.env.NOTION_TOKEN,
      logLevel: LogLevel.DEBUG,
      fetch: fetch as any, // Type assertion needed for compatibility
    })
    n2m = new NotionToMarkdown({ notionClient: notion })
    console.log("Notion client initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Notion client:", error)
    notion = null
    n2m = null
  }
} else {
  console.warn("Notion environment variables not configured. Blog functionality will use fallback behavior.")
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

export const getBlogPosts = cache(async () => {
  console.log("Starting getBlogPosts...")

  // Return empty array with helpful message if Notion is not configured
  if (!isNotionConfigured || !notion || !n2m) {
    console.warn("Notion not configured. Returning empty blog posts array.")
    throw new Error(
      "Blog functionality is not configured. Please set NOTION_TOKEN and BLOG_INDEX_ID environment variables to enable blog posts."
    )
  }

  try {
    console.log("Querying Notion database...")
    const response = await notion!.databases.query({
      database_id: process.env.BLOG_INDEX_ID!,
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
            const pageContent = await notion!.blocks.children.list({
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
            const mdBlocks = await n2m!.blocksToMarkdown(pageContent.results)
            const { parent: content } = n2m!.toMarkdownString(mdBlocks)

            console.log(`Processed post: ${title} with slug: ${slug}`)
            console.log(`Content preview: ${content.substring(0, 100)}...`)
            console.log(`Full content object:`, JSON.stringify(n2m!.toMarkdownString(mdBlocks), null, 2))

            return {
              id: page.id,
              title,
              description,
              date,
              slug,
              author,
              published,
              content,
              fullContentObject: n2m!.toMarkdownString(mdBlocks), // Including full content object for debugging
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
    console.log("Post content preview:", post.content.substring(0, 100))
    return post
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
