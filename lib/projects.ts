import fs from 'fs/promises';
import path from 'path';
import { Project, ProjectFrontmatter, ProjectFrontmatterSchema, ProjectService } from './types';
import { compileProjectMDX, compileMDXWithFrontmatter, extractFrontmatter, validateMDXSyntax } from './mdx';

// React cache import with fallback for non-React environments
let cache: <T extends (...args: any[]) => any>(fn: T) => T;
try {
  cache = require('react').cache;
} catch {
  // Fallback for non-React environments (like testing)
  cache = <T extends (...args: any[]) => any>(fn: T): T => fn;
}

// Cache the project loading for performance
const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');
const ASSETS_DIR = path.join(process.cwd(), 'public');

/**
 * File-based project service implementation
 */
class FileBasedProjectService implements ProjectService {
  private projectsCache: Map<string, Project> = new Map();
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in development

  /**
   * Check if cache is still valid
   */
  private isCacheValid(): boolean {
    return Date.now() - this.lastCacheUpdate < this.CACHE_TTL;
  }

  /**
   * Clear the projects cache
   */
  private clearCache(): void {
    this.projectsCache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Get all markdown files from the projects directory
   */
  private async getProjectFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(PROJECTS_DIR);
      return files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    } catch (error) {
      console.error('Error reading projects directory:', error);
      return [];
    }
  }

  /**
   * Read and parse a single project file
   */
  private async parseProjectFile(filename: string): Promise<Project | null> {
    try {
      const filePath = path.join(PROJECTS_DIR, filename);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Validate MDX syntax first
      const validation = validateMDXSyntax(fileContent);
      if (!validation.valid) {
        console.error(`Invalid MDX syntax in ${filename}:`, validation.errors);
        return null;
      }

      // Extract and validate frontmatter
      const frontmatter = extractFrontmatter(fileContent);
      if (!frontmatter) {
        console.error(`No frontmatter found in ${filename}`);
        return null;
      }

      // Extract frontmatter for validation (without full compilation)
      const { frontmatter: validatedFrontmatter } = await compileMDXWithFrontmatter(
        fileContent, 
        ProjectFrontmatterSchema,
        undefined,
        false // Don't compile content, only extract frontmatter
      );

      // Calculate reading time and word count from raw content
      const plainText = fileContent.replace(/---[\s\S]*?---/, '').replace(/[#*`]/g, '');
      const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);

      // Generate slug from filename
      const slug = filename.replace(/\.(md|mdx)$/, '');
      
      // Resolve asset paths
      const resolvedFrontmatter = await this.resolveAssetPaths(validatedFrontmatter, slug);

      // Create project object
      const project: Project = {
        id: slug,
        slug,
        title: resolvedFrontmatter.title,
        subtitle: resolvedFrontmatter.subtitle,
        description: this.extractDescription(fileContent),
        content: fileContent, // Store raw content for compilation in page component
        date: resolvedFrontmatter.date,
        status: resolvedFrontmatter.status,
        tags: resolvedFrontmatter.tags,
        github: resolvedFrontmatter.github,
        live: resolvedFrontmatter.live,
        image: resolvedFrontmatter.image,
        video: resolvedFrontmatter.video,
        pinned: resolvedFrontmatter.pinned || false,
        category: resolvedFrontmatter.category,
        source: 'file-based',
        priority: this.calculatePriority(resolvedFrontmatter),
        readingTime,
        wordCount,
      };

      return project;
    } catch (error) {
      console.error(`Error parsing project file ${filename}:`, error);
      return null;
    }
  }

  /**
   * Resolve relative asset paths to absolute paths
   */
  private async resolveAssetPaths(
    frontmatter: ProjectFrontmatter, 
    slug: string
  ): Promise<ProjectFrontmatter> {
    const resolved = { ...frontmatter };

    // Resolve image path
    if (resolved.image && resolved.image.startsWith('./')) {
      resolved.image = await this.resolveAssetPath(resolved.image, slug);
    }

    // Resolve video path
    if (resolved.video && resolved.video.startsWith('./')) {
      resolved.video = await this.resolveAssetPath(resolved.video, slug);
    }

    return resolved;
  }

  /**
   * Resolve a single asset path
   */
  private async resolveAssetPath(relativePath: string, slug: string): Promise<string> {
    // Remove leading './'
    const cleanPath = relativePath.replace(/^\.\//, '');
    
    // Check if it's a project-specific asset
    if (cleanPath.startsWith('assets/')) {
      const publicPath = `/media/${cleanPath.replace('assets/', '')}`;
      
      // Verify the file exists
      const fullPath = path.join(ASSETS_DIR, 'media', cleanPath.replace('assets/', ''));
      try {
        await fs.access(fullPath);
        return publicPath;
      } catch {
        console.warn(`Asset not found: ${fullPath}`);
        return relativePath; // Return original if not found
      }
    }

    // For other relative paths, assume they're in the public directory
    const publicPath = `/${cleanPath}`;
    const fullPath = path.join(ASSETS_DIR, cleanPath);
    try {
      await fs.access(fullPath);
      return publicPath;
    } catch {
      console.warn(`Asset not found: ${fullPath}`);
      return relativePath; // Return original if not found
    }
  }

  /**
   * Extract description from content (first paragraph after frontmatter)
   */
  private extractDescription(content: string): string {
    // Remove frontmatter
    const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/, '');
    
    // Find first paragraph
    const paragraphMatch = withoutFrontmatter.match(/^([^#\n]+)/);
    if (paragraphMatch) {
      return paragraphMatch[1].trim().replace(/[*_`]/g, '').substring(0, 200);
    }

    // Fallback to first heading content
    const headingMatch = withoutFrontmatter.match(/^#\s+(.+)/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }

    return 'No description available';
  }

  /**
   * Calculate project priority for sorting (higher = more important)
   */
  private calculatePriority(frontmatter: ProjectFrontmatter): number {
    let priority = 0;

    // Pinned projects get highest priority
    if (frontmatter.pinned) priority += 100;

    // Currently building projects get high priority
    if (frontmatter.status === 'currently-building') priority += 50;

    // Recent projects get higher priority
    const projectDate = new Date(frontmatter.date);
    const daysSinceCreation = (Date.now() - projectDate.getTime()) / (1000 * 60 * 60 * 24);
    priority += Math.max(0, 30 - daysSinceCreation); // Up to 30 points for recent projects

    return priority;
  }

  /**
   * Load all file-based projects
   */
  async getFileBasedProjects(): Promise<Project[]> {
    // Return cached results if still valid
    if (this.isCacheValid() && this.projectsCache.size > 0) {
      return Array.from(this.projectsCache.values());
    }

    const projectFiles = await this.getProjectFiles();
    const projects: Project[] = [];

    // Parse each project file
    for (const filename of projectFiles) {
      const project = await this.parseProjectFile(filename);
      if (project) {
        projects.push(project);
        this.projectsCache.set(project.slug, project);
      }
    }

    // Sort by priority (highest first)
    projects.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    this.lastCacheUpdate = Date.now();
    return projects;
  }

  /**
   * Get hardcoded projects (placeholder - to be implemented based on existing data)
   */
  async getHardcodedProjects(): Promise<Project[]> {
    // This would integrate with existing hardcoded projects
    // For now, return empty array as this will be implemented in a later task
    return [];
  }

  /**
   * Get all projects (both hardcoded and file-based)
   */
  async getAllProjects(): Promise<Project[]> {
    const [hardcodedProjects, fileBasedProjects] = await Promise.all([
      this.getHardcodedProjects(),
      this.getFileBasedProjects(),
    ]);

    // Combine and sort by priority
    const allProjects = [...hardcodedProjects, ...fileBasedProjects];
    return allProjects.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Get a single project by slug
   */
  async getProject(slug: string): Promise<Project> {
    // Check cache first
    if (this.projectsCache.has(slug)) {
      const cached = this.projectsCache.get(slug);
      if (cached) return cached;
    }

    // Load all projects to populate cache
    await this.getFileBasedProjects();

    const project = this.projectsCache.get(slug);
    if (!project) {
      throw new Error(`Project not found: ${slug}`);
    }

    return project;
  }

  /**
   * Get projects by status
   */
  async getProjectsByStatus(status: string): Promise<Project[]> {
    const allProjects = await this.getAllProjects();
    return allProjects.filter(project => project.status === status);
  }

  /**
   * Get projects by tag
   */
  async getProjectsByTag(tag: string): Promise<Project[]> {
    const allProjects = await this.getAllProjects();
    return allProjects.filter(project => 
      project.tags.some(projectTag => 
        projectTag.toLowerCase() === tag.toLowerCase()
      )
    );
  }

  /**
   * Refresh the cache (useful for development)
   */
  async refreshCache(): Promise<void> {
    this.clearCache();
    await this.getFileBasedProjects();
  }

  /**
   * Get project statistics
   */
  async getProjectStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    totalTags: number;
  }> {
    const projects = await this.getAllProjects();
    
    const byStatus: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const allTags = new Set<string>();

    projects.forEach(project => {
      // Count by status
      byStatus[project.status] = (byStatus[project.status] || 0) + 1;
      
      // Count by category
      if (project.category) {
        byCategory[project.category] = (byCategory[project.category] || 0) + 1;
      }
      
      // Collect all tags
      project.tags.forEach(tag => allTags.add(tag));
    });

    return {
      total: projects.length,
      byStatus,
      byCategory,
      totalTags: allTags.size,
    };
  }
}

// Create and export the service instance
export const projectService = new FileBasedProjectService();

// Cached functions for use in React Server Components
export const getFileBasedProjects = cache(async () => {
  return projectService.getFileBasedProjects();
});

export const getAllProjects = cache(async () => {
  return projectService.getAllProjects();
});

export const getProject = cache(async (slug: string) => {
  return projectService.getProject(slug);
});

export const getProjectsByStatus = cache(async (status: string) => {
  return projectService.getProjectsByStatus(status);
});

export const getProjectsByTag = cache(async (tag: string) => {
  return projectService.getProjectsByTag(tag);
});

export const getProjectStats = cache(async () => {
  return projectService.getProjectStats();
});

// Utility functions for asset management
export async function getProjectAssets(slug: string): Promise<string[]> {
  const assetsDir = path.join(ASSETS_DIR, 'media', slug);
  
  try {
    const files = await fs.readdir(assetsDir);
    return files.map(file => `/media/${slug}/${file}`);
  } catch {
    return []; // Return empty array if assets directory doesn't exist
  }
}

export async function validateProjectAsset(assetPath: string): Promise<boolean> {
  try {
    const fullPath = path.join(ASSETS_DIR, assetPath.replace(/^\//, ''));
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create project directory structure for a new project
 */
export async function createProjectStructure(slug: string): Promise<void> {
  const projectDir = path.join(PROJECTS_DIR);
  const assetsDir = path.join(ASSETS_DIR, 'media', slug);

  try {
    // Ensure projects directory exists
    await fs.mkdir(projectDir, { recursive: true });
    
    // Create assets directory for the project
    await fs.mkdir(assetsDir, { recursive: true });
    
    console.log(`Created project structure for: ${slug}`);
  } catch (error) {
    console.error(`Failed to create project structure for ${slug}:`, error);
    throw error;
  }
}

/**
 * Validate project directory structure
 */
export async function validateProjectStructure(): Promise<{
  valid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    // Check if projects directory exists
    await fs.access(PROJECTS_DIR);
  } catch {
    issues.push('Projects directory does not exist: content/projects');
  }

  try {
    // Check if media directory exists
    await fs.access(path.join(ASSETS_DIR, 'media'));
  } catch {
    issues.push('Media directory does not exist: public/media');
  }

  // Check for common issues in project files
  try {
    const projectFiles = await fs.readdir(PROJECTS_DIR);
    const mdFiles = projectFiles.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    if (mdFiles.length === 0) {
      issues.push('No markdown files found in projects directory');
    }

    // Validate each project file
    for (const file of mdFiles.slice(0, 5)) { // Check first 5 files to avoid performance issues
      try {
        const content = await fs.readFile(path.join(PROJECTS_DIR, file), 'utf-8');
        const validation = validateMDXSyntax(content);
        if (!validation.valid) {
          issues.push(`Invalid MDX syntax in ${file}: ${validation.errors.join(', ')}`);
        }
      } catch (error) {
        issues.push(`Cannot read project file ${file}: ${error}`);
      }
    }
  } catch (error) {
    issues.push(`Cannot validate project files: ${error}`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}