import { Client, LogLevel, APIErrorCode, isNotionClientError, ClientErrorCode } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import { cache } from "react"
import fetch from "node-fetch-native"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { cachedFunction, CACHE_CONFIG, cacheMonitor } from './cache'
import { config, requireService } from './config'

// Retry configuration - Updated based on 2024 Notion API research
const RETRY_CONFIG = {
  maxRetries: 6, // Increased based on GitHub findings for large datasets
  baseDelay: 2000, // Increased base delay for 502/504 errors
  maxDelay: 45000, // Extended max delay for production reliability  
  backoffFactor: 2.5, // More aggressive backoff
  jitterRange: 0.5, // Add jitter to prevent thundering herd
}

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  requestQueue: [] as Array<() => Promise<any>>,
  processing: false,
  minInterval: 200, // Minimum 200ms between requests
}

// Enhanced retry function with exponential backoff
// Add jitter to prevent thundering herd - Based on GitHub research
function addJitter(delay: number): number {
  const jitter = delay * RETRY_CONFIG.jitterRange * (Math.random() - 0.5) * 2
  return Math.max(delay + jitter, 500) // Minimum 500ms
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  context: string,
  retryCount = 0
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retryCount >= RETRY_CONFIG.maxRetries) {
      console.error(`Max retries exceeded for ${context}:`, error)
      throw error
    }

    if (isNotionClientError(error)) {
      // Handle rate limiting with longer delay
      if (error.code === APIErrorCode.RateLimited) {
        const baseDelay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, retryCount + 2)
        const delay = Math.min(addJitter(baseDelay), RETRY_CONFIG.maxDelay)
        console.log(`Rate limited in ${context}. Retrying in ${Math.round(delay)}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`)
        await sleep(delay)
        return retryWithBackoff(operation, context, retryCount + 1)
      }

      // Handle authentication errors - Based on 2024 token format changes
      if (error.code === APIErrorCode.Unauthorized) {
        console.error(`Authentication failed in ${context}. Check if using new ntn_ token format:`, error)
        throw error // Don't retry auth errors
      }

      // Handle other retryable errors including timeouts and server errors
      if (error.code === ClientErrorCode.RequestTimeout || 
          error.code === APIErrorCode.InternalServerError ||
          error.code === APIErrorCode.ServiceUnavailable) {
        const baseDelay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, retryCount)
        const delay = Math.min(addJitter(baseDelay), RETRY_CONFIG.maxDelay)
        console.log(`Retryable error in ${context}: ${error.code}. Retrying in ${Math.round(delay)}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`)
        await sleep(delay)
        return retryWithBackoff(operation, context, retryCount + 1)
      }
    }

    // Handle potential 502/504 errors from large datasets (found in GitHub research)
    if (error instanceof Error) {
      if (error.message.includes('502') || error.message.includes('504') || 
          error.message.includes('gateway') || error.message.includes('timeout')) {
        const baseDelay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, retryCount)
        const delay = Math.min(addJitter(baseDelay), RETRY_CONFIG.maxDelay)
        console.log(`Gateway error in ${context}: ${error.message}. Retrying in ${Math.round(delay)}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`)
        await sleep(delay)
        return retryWithBackoff(operation, context, retryCount + 1)
      }
    }

    // Non-retryable error, throw immediately
    throw error
  }
}

// Rate-limited request queue
async function queueNotionRequest<T>(operation: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    RATE_LIMIT_CONFIG.requestQueue.push(async () => {
      try {
        const result = await operation()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
    processQueue()
  })
}

// Process the request queue with rate limiting
async function processQueue() {
  if (RATE_LIMIT_CONFIG.processing || RATE_LIMIT_CONFIG.requestQueue.length === 0) {
    return
  }

  RATE_LIMIT_CONFIG.processing = true

  while (RATE_LIMIT_CONFIG.requestQueue.length > 0) {
    const request = RATE_LIMIT_CONFIG.requestQueue.shift()
    if (request) {
      try {
        await request()
      } catch (error) {
        console.error('Error in queued request:', error)
      }
      // Wait between requests to respect rate limits
      await sleep(RATE_LIMIT_CONFIG.minInterval)
    }
  }

  RATE_LIMIT_CONFIG.processing = false
}

// Simple sleep utility
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Initialize Notion client with configuration validation
let notion: Client
let n2m: NotionToMarkdown

// Only initialize if Notion is configured, otherwise functions will use fallbacks
if (config.features.notion && config.notion) {
  try {
    notion = new Client({
      auth: config.notion.token,
      logLevel: config.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN,
      fetch: fetch as any, // Type assertion needed for compatibility
    })
    n2m = new NotionToMarkdown({ notionClient: notion })
    console.log("✅ Notion client initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Notion client:", error)
    throw new Error("Failed to initialize Notion client. Please check your NOTION_TOKEN.")
  }
} else {
  console.log("⚠️ Notion client not initialized - using fallback mode")
  // Create dummy clients to avoid runtime errors - functions will handle fallbacks
  notion = {} as Client
  n2m = {} as NotionToMarkdown
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

export const getBlogPosts = cache(async (forceRefresh = false) => {
  console.log("Starting getBlogPosts...")

  // Check if Notion is configured, if not, fallback system will handle it
  if (!config.features.notion || !config.notion) {
    console.log("Notion not configured - delegating to fallback system")
    throw new Error("Notion API not configured - fallback system will be used")
  }

  // Use enhanced caching to reduce API calls
  return cachedFunction(
    CACHE_CONFIG.BLOG_POSTS.key,
    async () => {
      console.log("Cache miss - fetching fresh blog posts from Notion...")
      
      // Log current cache stats
      cacheMonitor.logStats()
      
      const response = await retryWithBackoff(
        () => queueNotionRequest(() => notion.databases.query({
          database_id: config.notion!.blogIndexId,
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
        })),
        "database query"
      )

      console.log(`Found ${response.results.length} published posts`)

      // Process posts sequentially to avoid overwhelming the API
      const posts: any[] = []
      const filteredPages = response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)

      for (const page of filteredPages) {
        try {
          console.log(`Processing page: ${page.id}`)
          
          // Use cached page content if available
          const pageContent = await cachedFunction(
            CACHE_CONFIG.PAGE_CONTENT.key(page.id),
            () => retryWithBackoff(
              () => queueNotionRequest(() => notion.blocks.children.list({
                block_id: page.id,
              })),
              `page content for ${page.id}`
            ),
            CACHE_CONFIG.PAGE_CONTENT.ttl
          )

          // Extract properties with type guards
          const pageProperty = page.properties.Page
          const title = (pageProperty && 'title' in pageProperty && pageProperty.title?.[0]?.plain_text) || "Untitled"
          
          const slugProperty = page.properties.Slug
          const providedSlug = (slugProperty && 'rich_text' in slugProperty && slugProperty.rich_text?.[0]?.plain_text) || null
          const slug = providedSlug ? createSlug(providedSlug) : createSlug(title)

          const descProperty = page.properties.Description
          const description = (descProperty && 'rich_text' in descProperty && descProperty.rich_text?.[0]?.plain_text) || ""
          
          const dateProperty = page.properties.Date
          const date = (dateProperty && 'date' in dateProperty && dateProperty.date?.start) || new Date().toISOString()
          
          const authorProperty = page.properties.Author
          const authorObj = authorProperty && 'people' in authorProperty && authorProperty.people?.[0]
          const author = (authorObj && 'name' in authorObj ? authorObj.name : null) || "Anonymous"
          
          const publishedProperty = page.properties.published
          const published = (publishedProperty && 'checkbox' in publishedProperty && publishedProperty.checkbox) || false

          console.log(`Converting blocks to markdown for page: ${page.id}`)
          const mdBlocks = await n2m.blocksToMarkdown(pageContent.results)
          const { parent: content } = n2m.toMarkdownString(mdBlocks)

          console.log(`Processed post: ${title} with slug: ${slug}`)
          
          posts.push({
            id: page.id,
            title,
            description,
            date,
            slug,
            author,
            published,
            content,
            fullContentObject: n2m.toMarkdownString(mdBlocks),
          })

        } catch (error) {
          console.error(`Error processing page ${page.id}:`, error)
          // Continue processing other posts instead of failing completely
        }
      }

      console.log(`Successfully processed ${posts.length} blog posts`)
      return posts
    },
    CACHE_CONFIG.BLOG_POSTS.ttl,
    forceRefresh
  )
})

export const getBlogPost = cache(async (slug: string) => {
  console.log("Starting getBlogPost for slug:", slug)

  if (!slug) {
    throw new Error("Slug is required")
  }

  // Use individual post caching
  return cachedFunction(
    CACHE_CONFIG.BLOG_POST.key(slug),
    async () => {
      console.log(`Cache miss - fetching blog post for slug: ${slug}`)
      
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
    },
    CACHE_CONFIG.BLOG_POST.ttl
  )
})
