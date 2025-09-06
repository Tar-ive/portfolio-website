interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map()

  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000, // Convert to milliseconds
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    const isExpired = now - item.timestamp > item.ttl

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  // Get stale data (even if expired) for fallback purposes
  getStale<T>(key: string): T | null {
    const item = this.cache.get(key)
    return item ? (item.data as T) : null
  }

  // Get all cache keys for invalidation purposes
  getAllKeys(): string[] {
    return Array.from(this.cache.keys())
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    // Clean expired items first
    this.cleanExpired()
    return this.cache.size
  }

  private cleanExpired(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache statistics
  getStats() {
    this.cleanExpired()
    const totalSize = this.cache.size
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      age: Date.now() - item.timestamp,
      ttl: item.ttl,
      expired: Date.now() - item.timestamp > item.ttl
    }))

    return {
      totalSize,
      items,
      oldestItem: items.length > 0 ? Math.max(...items.map(i => i.age)) : 0,
      newestItem: items.length > 0 ? Math.min(...items.map(i => i.age)) : 0
    }
  }
}

// Global cache instance
export const memoryCache = new MemoryCache()

// Cache configuration for different data types
export const CACHE_CONFIG = {
  // Blog posts cache for 10 minutes (reduced from default to keep content fresh)
  BLOG_POSTS: {
    key: 'notion:blog-posts',
    ttl: 600, // 10 minutes
  },
  
  // Individual blog post cache for 2 hours (reduce API load)
  BLOG_POST: {
    key: (slug: string) => `notion:blog-post:${slug}`,
    ttl: 7200, // 2 hours
  },
  
  // Notion database schema cache for 1 hour (rarely changes)
  DATABASE_SCHEMA: {
    key: (dbId: string) => `notion:schema:${dbId}`,
    ttl: 3600, // 1 hour
  },
  
  // Page content cache for 1 hour (reduce API load)
  PAGE_CONTENT: {
    key: (pageId: string) => `notion:page:${pageId}`,
    ttl: 3600, // 1 hour
  }
}

/**
 * Enhanced caching wrapper for async functions
 */
export async function cachedFunction<T>(
  cacheKey: string,
  asyncFunction: () => Promise<T>,
  ttlSeconds: number = 3600,
  forceRefresh: boolean = false
): Promise<T> {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = memoryCache.get<T>(cacheKey)
    if (cached !== null) {
      console.log(`Cache HIT for key: ${cacheKey}`)
      return cached
    }
  }

  console.log(`Cache MISS for key: ${cacheKey} - fetching fresh data`)
  
  try {
    // Fetch fresh data
    const freshData = await asyncFunction()
    
    // Cache the result
    memoryCache.set(cacheKey, freshData, ttlSeconds)
    
    console.log(`Cached data for key: ${cacheKey} (TTL: ${ttlSeconds}s)`)
    return freshData
  } catch (error) {
    // On error, try to return stale cache data as fallback
    const staleData = memoryCache.getStale<T>(cacheKey)
    if (staleData) {
      console.warn(`Error fetching fresh data for ${cacheKey}, returning stale cache:`, error)
      return staleData
    }
    
    // No cache available, throw the error
    throw error
  }
}

/**
 * Preload cache with data (useful for warming up cache)
 */
export function preloadCache<T>(
  cacheKey: string,
  data: T,
  ttlSeconds: number = 3600
): void {
  memoryCache.set(cacheKey, data, ttlSeconds)
  console.log(`Preloaded cache for key: ${cacheKey}`)
}

/**
 * Cache invalidation utilities
 */
export const cacheInvalidation = {
  // Invalidate specific cache key
  invalidateKey(key: string): void {
    memoryCache.delete(key)
    console.log(`Invalidated cache key: ${key}`)
  },

  // Invalidate all blog-related caches
  invalidateBlogCaches(): void {
    const keys = memoryCache.getAllKeys()
    keys.forEach(key => {
      if (key.startsWith('notion:blog')) {
        memoryCache.delete(key)
      }
    })
    console.log('Invalidated all blog caches')
  },

  // Invalidate all Notion caches
  invalidateAllNotion(): void {
    const keys = memoryCache.getAllKeys()
    keys.forEach(key => {
      if (key.startsWith('notion:')) {
        memoryCache.delete(key)
      }
    })
    console.log('Invalidated all Notion caches')
  },

  // Clear all caches
  clearAll(): void {
    memoryCache.clear()
    console.log('Cleared all caches')
  }
}

/**
 * Cache monitoring and debugging
 */
export const cacheMonitor = {
  getStats() {
    return memoryCache.getStats()
  },

  logStats(): void {
    const stats = memoryCache.getStats()
    console.log('Cache Statistics:', {
      totalItems: stats.totalSize,
      oldestItemAge: `${Math.round(stats.oldestItem / 1000)}s`,
      newestItemAge: `${Math.round(stats.newestItem / 1000)}s`,
      items: stats.items.map(item => ({
        key: item.key,
        age: `${Math.round(item.age / 1000)}s`,
        remaining: `${Math.round((item.ttl - item.age) / 1000)}s`
      }))
    })
  },

  // Get cache hit rate (requires tracking)
  getHitRate(): { hits: number, misses: number, rate: number } {
    // This would require more sophisticated tracking
    // For now, return a placeholder
    return { hits: 0, misses: 0, rate: 0 }
  }
}

export default {
  memoryCache,
  cachedFunction,
  preloadCache,
  cacheInvalidation,
  cacheMonitor,
  CACHE_CONFIG
}