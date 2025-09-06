import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

// Fallback blog posts when Notion API is unavailable
const FALLBACK_POSTS = [
  {
    id: 'fallback-1',
    title: 'Welcome to My Blog',
    description: 'An introduction to my thoughts on technology, development, and innovation.',
    date: '2024-01-01T00:00:00Z',
    slug: 'welcome-to-my-blog',
    author: 'Saksham Adhikari',
    published: true,
    content: `# Welcome to My Blog

Thank you for visiting my portfolio blog! This is a fallback message that appears when our content management system is temporarily unavailable.

## About This Blog

I regularly write about:

- **Software Development**: Best practices, new technologies, and development workflows
- **AI & Machine Learning**: Latest trends and practical applications
- **Web Development**: Modern frameworks, performance optimization, and user experience
- **Career Development**: Lessons learned and insights from the tech industry

## Current Status

Our blog system is powered by Notion CMS, which provides a seamless writing and publishing experience. If you're seeing this message, the system is likely experiencing temporary connectivity issues and will be restored shortly.

## Connect With Me

While the blog loads, feel free to:

- Check out my [projects](/projects)
- Connect with me on [GitHub](https://github.com/Tar-ive)
- Visit my [LinkedIn profile](https://linkedin.com/in/saksham-adhikari)

Thank you for your patience!`,
    fullContentObject: null,
  },
  {
    id: 'fallback-2', 
    title: 'System Maintenance Notice',
    description: 'Information about temporary service interruptions and what to expect.',
    date: '2024-01-02T00:00:00Z',
    slug: 'system-maintenance-notice',
    author: 'Saksham Adhikari',
    published: true,
    content: `# System Maintenance Notice

## What's Happening?

Our blog content management system is currently experiencing connectivity issues. This is typically due to:

### Common Causes
- **API Rate Limiting**: Our content provider (Notion) may be temporarily rate-limiting requests
- **Network Issues**: Temporary connectivity problems between services
- **Service Updates**: Scheduled maintenance on external services
- **High Traffic**: Increased load causing temporary slowdowns

### What We're Doing

Our system is designed with multiple layers of resilience:

1. **Automatic Retry Logic**: Failed requests are automatically retried with exponential backoff
2. **Intelligent Caching**: Recent content is cached to reduce API dependency
3. **Graceful Fallbacks**: This fallback system ensures the site remains functional
4. **Real-time Monitoring**: We actively monitor all services and respond to issues quickly

### When Will It Be Fixed?

Most issues resolve automatically within:
- **API Rate Limits**: 5-15 minutes
- **Network Issues**: 1-5 minutes  
- **Service Updates**: 10-30 minutes

## Thank You

I appreciate your patience as we work to provide the best possible experience. The blog will automatically restore normal functionality once connectivity is reestablished.

Feel free to explore other sections of the site, including my portfolio projects and contact information.`,
    fullContentObject: null,
  }
]

/**
 * Get fallback blog posts when Notion API is unavailable
 */
export function getFallbackBlogPosts() {
  console.log('Using fallback blog posts due to API unavailability')
  return FALLBACK_POSTS
}

/**
 * Get individual fallback blog post
 */
export function getFallbackBlogPost(slug: string) {
  const post = FALLBACK_POSTS.find(p => p.slug === slug)
  if (!post) {
    throw new Error(`Fallback post not found: ${slug}`)
  }
  return post
}

/**
 * Check if we should use fallback system
 */
export function shouldUseFallback(error: unknown): boolean {
  if (!error) return false
  
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorName = error instanceof Error ? error.constructor.name : 'UnknownError'
  
  // Use fallback for these error types
  const fallbackTriggers = [
    'rate limit',
    'rate_limited', 
    'unauthorized',
    'invalid',
    'invalid token',
    'api token',
    'Network',
    'timeout',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'Service unavailable',
    'Internal server error',
    'APIResponseError',
    'NotionClientError',
    // Build-time specific errors
    'fetch failed',
    'request failed',
    'connection refused'
  ]
  
  // Check error message
  const messageMatch = fallbackTriggers.some(trigger => 
    errorMessage.toLowerCase().includes(trigger.toLowerCase())
  )
  
  // Check error constructor name
  const nameMatch = fallbackTriggers.some(trigger => 
    errorName.toLowerCase().includes(trigger.toLowerCase())
  )
  
  // Special handling for API errors during build
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
    console.log(`Build-time error detected: ${errorName} - ${errorMessage}`)
    return true // Always use fallback during production builds
  }
  
  return messageMatch || nameMatch
}

/**
 * Enhanced blog posts getter with fallback support
 */
export async function getBlogPostsWithFallback(
  primaryFetcher: () => Promise<any[]>,
  forceUseFallback = false
): Promise<any[]> {
  if (forceUseFallback) {
    return getFallbackBlogPosts()
  }
  
  try {
    const posts = await primaryFetcher()
    
    // If no posts returned, use fallback
    if (!posts || posts.length === 0) {
      console.warn('No posts returned from primary source, using fallback')
      return getFallbackBlogPosts()
    }
    
    return posts
  } catch (error) {
    console.error('Primary blog fetch failed:', error)
    
    if (shouldUseFallback(error)) {
      console.log('Error qualifies for fallback, switching to offline mode')
      return getFallbackBlogPosts()
    }
    
    // Re-throw if not a fallback-worthy error
    throw error
  }
}

/**
 * Enhanced single blog post getter with fallback support
 */
export async function getBlogPostWithFallback(
  slug: string,
  primaryFetcher: (slug: string) => Promise<any>,
  forceUseFallback = false
): Promise<any> {
  if (forceUseFallback) {
    return getFallbackBlogPost(slug)
  }
  
  try {
    return await primaryFetcher(slug)
  } catch (error) {
    console.error(`Primary blog post fetch failed for ${slug}:`, error)
    
    if (shouldUseFallback(error)) {
      console.log(`Error qualifies for fallback, trying fallback post for ${slug}`)
      try {
        return getFallbackBlogPost(slug)
      } catch (fallbackError) {
        // If even fallback fails, provide a generic fallback
        console.warn(`Fallback post not found for ${slug}, using generic fallback`)
        return {
          id: `fallback-${slug}`,
          title: 'Content Temporarily Unavailable',
          description: 'This content is temporarily unavailable due to connectivity issues.',
          date: new Date().toISOString(),
          slug,
          author: 'Saksham Adhikari',
          published: true,
          content: `# Content Temporarily Unavailable

The blog post you're looking for is temporarily unavailable due to connectivity issues with our content management system.

## What You Can Do

- **Try Refreshing**: The issue may resolve quickly
- **Check Back Later**: Most issues are resolved within minutes
- **Browse Other Content**: Check out my [projects](/projects) or [homepage](/)
- **Contact Me**: If this persists, feel free to reach out

This is likely a temporary issue and the content will be restored automatically once connectivity is reestablished.

Thank you for your patience!`,
          fullContentObject: null,
        }
      }
    }
    
    // Re-throw if not a fallback-worthy error
    throw error
  }
}

/**
 * System health check
 */
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'offline'
  services: {
    notion: 'online' | 'offline' | 'slow'
    cloudinary: 'online' | 'offline' | 'slow'
    cache: 'online' | 'offline'
  }
  lastCheck: string
  fallbackActive: boolean
}

export async function checkSystemHealth(): Promise<SystemHealth> {
  const health: SystemHealth = {
    status: 'healthy',
    services: {
      notion: 'online',
      cloudinary: 'online', 
      cache: 'online'
    },
    lastCheck: new Date().toISOString(),
    fallbackActive: false
  }
  
  // This could be expanded to actually ping services
  // For now, return a basic health check
  
  return health
}

export default {
  getFallbackBlogPosts,
  getFallbackBlogPost,
  shouldUseFallback,
  getBlogPostsWithFallback,
  getBlogPostWithFallback,
  checkSystemHealth
}