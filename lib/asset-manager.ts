import fs from 'fs/promises';
import path from 'path';
import { MediaAsset, MediaAssetSchema } from './types';

const ASSETS_DIR = path.join(process.cwd(), 'public');
const MEDIA_DIR = path.join(ASSETS_DIR, 'media');

/**
 * Asset manager for handling project media files and relative path resolution
 */
export class AssetManager {
  private assetCache: Map<string, MediaAsset[]> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  private lastCacheUpdate: number = 0;

  /**
   * Check if cache is still valid
   */
  private isCacheValid(): boolean {
    return Date.now() - this.lastCacheUpdate < this.CACHE_TTL;
  }

  /**
   * Get file type from extension
   */
  private getFileType(filename: string): MediaAsset['type'] {
    const ext = path.extname(filename).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
      return 'image';
    }
    if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) {
      return 'video';
    }
    if (ext === '.pdf') {
      return 'pdf';
    }
    return 'document';
  }

  /**
   * Get file size
   */
  private async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  /**
   * Get image dimensions (placeholder - would use sharp or similar in production)
   */
  private async getImageDimensions(filePath: string): Promise<{ width: number; height: number } | undefined> {
    // This is a placeholder implementation
    // In a real application, you would use a library like 'sharp' to get actual dimensions
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      // Return default dimensions for now
      return { width: 800, height: 600 };
    }
    
    return undefined;
  }

  /**
   * Scan directory for media assets
   */
  private async scanDirectory(dirPath: string, baseUrl: string = ''): Promise<MediaAsset[]> {
    const assets: MediaAsset[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.join(baseUrl, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subAssets = await this.scanDirectory(fullPath, relativePath);
          assets.push(...subAssets);
        } else if (entry.isFile()) {
          // Process file
          const asset: MediaAsset = {
            path: `/${relativePath.replace(/\\/g, '/')}`, // Ensure forward slashes for URLs
            type: this.getFileType(entry.name),
            size: await this.getFileSize(fullPath),
            dimensions: await this.getImageDimensions(fullPath),
            optimized: false, // Would be set based on optimization status
          };

          // Validate with schema
          try {
            const validatedAsset = MediaAssetSchema.parse(asset);
            assets.push(validatedAsset);
          } catch (error) {
            console.warn(`Invalid asset skipped: ${relativePath}`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }

    return assets;
  }

  /**
   * Get all assets for a specific project
   */
  async getProjectAssets(projectSlug: string): Promise<MediaAsset[]> {
    const cacheKey = `project:${projectSlug}`;
    
    // Return cached results if valid
    if (this.isCacheValid() && this.assetCache.has(cacheKey)) {
      return this.assetCache.get(cacheKey) || [];
    }

    const projectAssetsDir = path.join(MEDIA_DIR, projectSlug);
    const assets = await this.scanDirectory(projectAssetsDir, `media/${projectSlug}`);
    
    // Cache the results
    this.assetCache.set(cacheKey, assets);
    this.lastCacheUpdate = Date.now();

    return assets;
  }

  /**
   * Get all media assets
   */
  async getAllAssets(): Promise<MediaAsset[]> {
    const cacheKey = 'all-assets';
    
    // Return cached results if valid
    if (this.isCacheValid() && this.assetCache.has(cacheKey)) {
      return this.assetCache.get(cacheKey) || [];
    }

    const assets = await this.scanDirectory(MEDIA_DIR, 'media');
    
    // Cache the results
    this.assetCache.set(cacheKey, assets);
    this.lastCacheUpdate = Date.now();

    return assets;
  }

  /**
   * Resolve relative asset path to absolute URL
   */
  async resolveAssetPath(relativePath: string, projectSlug?: string): Promise<string | null> {
    // Handle absolute paths
    if (relativePath.startsWith('/')) {
      return relativePath;
    }

    // Handle external URLs
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }

    // Handle relative paths starting with './'
    if (relativePath.startsWith('./')) {
      const cleanPath = relativePath.replace(/^\.\//, '');
      
      // If it's an assets path, resolve to project-specific media
      if (cleanPath.startsWith('assets/') && projectSlug) {
        const assetPath = cleanPath.replace('assets/', '');
        const fullPath = `/media/${projectSlug}/${assetPath}`;
        
        // Verify the asset exists
        if (await this.validateAssetExists(fullPath)) {
          return fullPath;
        }
      }
      
      // Try resolving to general media directory
      const generalPath = `/media/${cleanPath}`;
      if (await this.validateAssetExists(generalPath)) {
        return generalPath;
      }
      
      // Try resolving to root public directory
      const rootPath = `/${cleanPath}`;
      if (await this.validateAssetExists(rootPath)) {
        return rootPath;
      }
    }

    // If no resolution found, return null
    console.warn(`Could not resolve asset path: ${relativePath}`);
    return null;
  }

  /**
   * Validate that an asset exists
   */
  async validateAssetExists(assetPath: string): Promise<boolean> {
    try {
      const fullPath = path.join(ASSETS_DIR, assetPath.replace(/^\//, ''));
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get asset metadata
   */
  async getAssetMetadata(assetPath: string): Promise<MediaAsset | null> {
    try {
      const fullPath = path.join(ASSETS_DIR, assetPath.replace(/^\//, ''));
      
      const asset: MediaAsset = {
        path: assetPath,
        type: this.getFileType(assetPath),
        size: await this.getFileSize(fullPath),
        dimensions: await this.getImageDimensions(fullPath),
        optimized: false,
      };

      return MediaAssetSchema.parse(asset);
    } catch (error) {
      console.error(`Error getting asset metadata for ${assetPath}:`, error);
      return null;
    }
  }

  /**
   * Create asset directory for a project
   */
  async createProjectAssetDirectory(projectSlug: string): Promise<void> {
    const projectAssetsDir = path.join(MEDIA_DIR, projectSlug);
    
    try {
      await fs.mkdir(projectAssetsDir, { recursive: true });
      console.log(`Created asset directory for project: ${projectSlug}`);
    } catch (error) {
      console.error(`Failed to create asset directory for ${projectSlug}:`, error);
      throw error;
    }
  }

  /**
   * Get assets by type
   */
  async getAssetsByType(type: MediaAsset['type'], projectSlug?: string): Promise<MediaAsset[]> {
    const assets = projectSlug 
      ? await this.getProjectAssets(projectSlug)
      : await this.getAllAssets();
    
    return assets.filter(asset => asset.type === type);
  }

  /**
   * Search assets by filename pattern
   */
  async searchAssets(pattern: string, projectSlug?: string): Promise<MediaAsset[]> {
    const assets = projectSlug 
      ? await this.getProjectAssets(projectSlug)
      : await this.getAllAssets();
    
    const regex = new RegExp(pattern, 'i');
    return assets.filter(asset => regex.test(path.basename(asset.path)));
  }

  /**
   * Clear asset cache
   */
  clearCache(): void {
    this.assetCache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Get asset statistics
   */
  async getAssetStats(projectSlug?: string): Promise<{
    total: number;
    byType: Record<string, number>;
    totalSize: number;
    averageSize: number;
  }> {
    const assets = projectSlug 
      ? await this.getProjectAssets(projectSlug)
      : await this.getAllAssets();

    const byType: Record<string, number> = {};
    let totalSize = 0;

    assets.forEach(asset => {
      byType[asset.type] = (byType[asset.type] || 0) + 1;
      totalSize += asset.size;
    });

    return {
      total: assets.length,
      byType,
      totalSize,
      averageSize: assets.length > 0 ? totalSize / assets.length : 0,
    };
  }
}

// Create and export the asset manager instance
export const assetManager = new AssetManager();

// Utility functions for common asset operations
export async function resolveProjectAsset(
  relativePath: string, 
  projectSlug: string
): Promise<string | null> {
  return assetManager.resolveAssetPath(relativePath, projectSlug);
}

export async function getProjectImages(projectSlug: string): Promise<MediaAsset[]> {
  return assetManager.getAssetsByType('image', projectSlug);
}

export async function getProjectVideos(projectSlug: string): Promise<MediaAsset[]> {
  return assetManager.getAssetsByType('video', projectSlug);
}

export async function getProjectPDFs(projectSlug: string): Promise<MediaAsset[]> {
  return assetManager.getAssetsByType('pdf', projectSlug);
}

export async function validateAsset(assetPath: string): Promise<boolean> {
  return assetManager.validateAssetExists(assetPath);
}

/**
 * Transform markdown content to resolve relative asset paths
 */
export async function transformMarkdownAssets(
  content: string, 
  projectSlug: string
): Promise<string> {
  let transformedContent = content;

  // Find all image references
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const imageMatches = Array.from(content.matchAll(imageRegex));

  for (const match of imageMatches) {
    const [fullMatch, altText, originalPath] = match;
    const resolvedPath = await assetManager.resolveAssetPath(originalPath, projectSlug);
    
    if (resolvedPath) {
      const newImageTag = `![${altText}](${resolvedPath})`;
      transformedContent = transformedContent.replace(fullMatch, newImageTag);
    }
  }

  // Find all link references that might be assets
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  const linkMatches = Array.from(content.matchAll(linkRegex));

  for (const match of linkMatches) {
    const [fullMatch, linkText, originalPath] = match;
    
    // Skip if it's already an absolute URL or starts with #
    if (originalPath.startsWith('http') || originalPath.startsWith('#') || originalPath.startsWith('/')) {
      continue;
    }

    const resolvedPath = await assetManager.resolveAssetPath(originalPath, projectSlug);
    
    if (resolvedPath) {
      const newLinkTag = `[${linkText}](${resolvedPath})`;
      transformedContent = transformedContent.replace(fullMatch, newLinkTag);
    }
  }

  return transformedContent;
}

/**
 * Validate project asset structure
 */
export async function validateProjectAssetStructure(projectSlug: string): Promise<{
  valid: boolean;
  issues: string[];
  suggestions: string[];
}> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  try {
    const projectAssetsDir = path.join(MEDIA_DIR, projectSlug);
    
    // Check if project asset directory exists
    try {
      await fs.access(projectAssetsDir);
    } catch {
      issues.push(`Project asset directory does not exist: public/media/${projectSlug}`);
      suggestions.push(`Create the directory: mkdir -p public/media/${projectSlug}`);
      return { valid: false, issues, suggestions };
    }

    // Get project assets
    const assets = await assetManager.getProjectAssets(projectSlug);
    
    if (assets.length === 0) {
      suggestions.push(`Consider adding some media assets to public/media/${projectSlug}/`);
    }

    // Check for common asset types
    const hasImages = assets.some(asset => asset.type === 'image');
    const hasVideos = assets.some(asset => asset.type === 'video');
    
    if (!hasImages) {
      suggestions.push('Consider adding a hero image or screenshots for the project');
    }

    // Check for large files
    const largeAssets = assets.filter(asset => asset.size > 10 * 1024 * 1024); // 10MB
    if (largeAssets.length > 0) {
      suggestions.push(`Consider optimizing large assets: ${largeAssets.map(a => path.basename(a.path)).join(', ')}`);
    }

  } catch (error) {
    issues.push(`Error validating project assets: ${error}`);
  }

  return {
    valid: issues.length === 0,
    issues,
    suggestions,
  };
}