import { z } from 'zod'

/**
 * Environment variable validation schemas
 */

// Core application configuration
const CoreConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
})

// Notion CMS configuration
const NotionConfigSchema = z.object({
  NOTION_TOKEN: z.string().min(1, 'Notion token is required for blog functionality'),
  BLOG_INDEX_ID: z.string().min(1, 'Notion database ID is required for blog functionality'),
})

// Cloudinary configuration
const CloudinaryConfigSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Cloudinary cloud name is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'Cloudinary API key is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'Cloudinary API secret is required'),
})

// Complete configuration schema
const ConfigSchema = CoreConfigSchema.and(
  NotionConfigSchema.partial() // Make Notion config optional to allow fallback mode
).and(
  CloudinaryConfigSchema.partial() // Make Cloudinary config optional to allow local fallback
)

/**
 * Configuration validation results
 */
interface ConfigValidationResult {
  isValid: boolean
  config: any
  errors: string[]
  warnings: string[]
  missingServices: string[]
  availableServices: string[]
}

/**
 * Validate environment configuration
 */
function validateConfig(): ConfigValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const missingServices: string[] = []
  const availableServices: string[] = []

  // Get all environment variables
  const env = process.env

  // Validate core configuration
  try {
    const coreConfig = CoreConfigSchema.parse(env)
    availableServices.push('Core Application')
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => `Core config: ${e.path.join('.')}: ${e.message}`))
    }
  }

  // Check Notion configuration
  try {
    NotionConfigSchema.parse(env)
    availableServices.push('Notion CMS')
  } catch (error) {
    missingServices.push('Notion CMS')
    if (error instanceof z.ZodError) {
      const missingFields = error.errors.map(e => e.path.join('.'))
      warnings.push(`Notion CMS unavailable - missing: ${missingFields.join(', ')}. Blog will use fallback content.`)
    }
  }

  // Check Cloudinary configuration
  try {
    CloudinaryConfigSchema.parse(env)
    availableServices.push('Cloudinary Media')
  } catch (error) {
    missingServices.push('Cloudinary Media')
    if (error instanceof z.ZodError) {
      const missingFields = error.errors.map(e => e.path.join('.'))
      warnings.push(`Cloudinary unavailable - missing: ${missingFields.join(', ')}. Images will use local fallbacks.`)
    }
  }

  // Parse the complete configuration with partial services
  let config: any = {}
  try {
    config = ConfigSchema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => `Config: ${e.path.join('.')}: ${e.message}`))
    }
  }

  return {
    isValid: errors.length === 0,
    config,
    errors,
    warnings,
    missingServices,
    availableServices,
  }
}

/**
 * Get configuration with validation
 */
export function getConfig(): ConfigValidationResult {
  const result = validateConfig()
  
  // Log configuration status
  if (process.env.NODE_ENV !== 'test') {
    console.log('\n🔧 Configuration Status:')
    console.log(`✅ Available services: ${result.availableServices.join(', ')}`)
    
    if (result.missingServices.length > 0) {
      console.log(`⚠️  Services in fallback mode: ${result.missingServices.join(', ')}`)
    }
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Configuration Warnings:')
      result.warnings.forEach(warning => console.log(`   ${warning}`))
    }
    
    if (result.errors.length > 0) {
      console.log('\n❌ Configuration Errors:')
      result.errors.forEach(error => console.log(`   ${error}`))
    }
    
    console.log('')
  }

  return result
}

/**
 * Type-safe configuration access
 */
export const config = (() => {
  const result = getConfig()
  
  return {
    // Core configuration (always available)
    env: result.config.NODE_ENV || 'development',
    isDevelopment: result.config.NODE_ENV === 'development',
    isProduction: result.config.NODE_ENV === 'production',
    siteUrl: result.config.NEXT_PUBLIC_SITE_URL || result.config.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000',
    
    // Feature flags based on available configuration
    features: {
      notion: result.availableServices.includes('Notion CMS'),
      cloudinary: result.availableServices.includes('Cloudinary Media'),
      blog: result.availableServices.includes('Notion CMS'), // Blog requires Notion
    },
    
    // Service-specific configuration (may be undefined)
    notion: result.availableServices.includes('Notion CMS') ? {
      token: result.config.NOTION_TOKEN,
      blogIndexId: result.config.BLOG_INDEX_ID,
    } : null,
    
    cloudinary: result.availableServices.includes('Cloudinary Media') ? {
      cloudName: result.config.CLOUDINARY_CLOUD_NAME,
      apiKey: result.config.CLOUDINARY_API_KEY,
      apiSecret: result.config.CLOUDINARY_API_SECRET,
    } : null,
    
    // Validation info
    validation: {
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
      availableServices: result.availableServices,
      missingServices: result.missingServices,
    }
  }
})()

/**
 * Environment-specific helpers
 */
export const env = {
  isDev: config.env === 'development',
  isProd: config.env === 'production',
  isTest: config.env === 'test',
}

/**
 * Service availability checks
 */
export const services = {
  isNotionAvailable: () => config.features.notion,
  isCloudinaryAvailable: () => config.features.cloudinary,
  isBlogAvailable: () => config.features.blog,
  
  getUnavailableServices: () => config.validation.missingServices,
  getAvailableServices: () => config.validation.availableServices,
}

/**
 * Configuration validation for runtime checks
 */
export function requireService(service: string): void {
  switch (service) {
    case 'notion':
      if (!config.features.notion) {
        throw new Error('Notion CMS is required but not configured. Please check NOTION_TOKEN and BLOG_INDEX_ID environment variables.')
      }
      break
    case 'cloudinary':
      if (!config.features.cloudinary) {
        throw new Error('Cloudinary is required but not configured. Please check CLOUDINARY_* environment variables.')
      }
      break
    default:
      throw new Error(`Unknown service: ${service}`)
  }
}

/**
 * Development helpers
 */
export function logConfigStatus(): void {
  if (config.env === 'development') {
    console.table({
      'Node Environment': config.env,
      'Site URL': config.siteUrl,
      'Notion CMS': config.features.notion ? '✅ Available' : '❌ Fallback Mode',
      'Cloudinary': config.features.cloudinary ? '✅ Available' : '❌ Local Assets',
      'Blog System': config.features.blog ? '✅ Live Content' : '❌ Offline Content',
    })
  }
}

export default config