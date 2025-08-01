import { z } from 'zod';

// Project frontmatter schema for file-based projects
export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.string(),
  status: z.enum(['currently-building', 'completed', 'research']),
  tags: z.array(z.string()),
  github: z.string().url().optional(),
  live: z.string().url().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  pinned: z.boolean().optional().default(false),
  category: z.string().optional(),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

// Complete project schema including content
export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  content: z.string(),
  date: z.string(),
  status: z.enum(['currently-building', 'completed', 'research']),
  tags: z.array(z.string()),
  github: z.string().url().optional(),
  live: z.string().url().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  pinned: z.boolean().optional().default(false),
  category: z.string().optional(),
  source: z.enum(['hardcoded', 'file-based']),
  priority: z.number().optional(),
  readingTime: z.number().optional(),
  wordCount: z.number().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Blog post schema for Notion CMS integration
export const BlogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  rawContent: z.string(),
  date: z.string(),
  publishedAt: z.string(),
  author: z.string().default('Saksham Adhikari'),
  published: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

// Info page schema for static content
export const InfoPageSchema = z.object({
  title: z.string(),
  content: z.string(),
  lastUpdated: z.string().optional(),
});

export type InfoPage = z.infer<typeof InfoPageSchema>;

// Media asset schema
export const MediaAssetSchema = z.object({
  path: z.string(),
  type: z.enum(['image', 'video', 'pdf', 'document']),
  size: z.number(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
  optimized: z.boolean().optional().default(false),
});

export type MediaAsset = z.infer<typeof MediaAssetSchema>;

// Connection status for external services
export const ConnectionStatusSchema = z.object({
  connected: z.boolean(),
  error: z.string().optional(),
  lastSync: z.string().optional(),
  postsCount: z.number().optional(),
});

export type ConnectionStatus = z.infer<typeof ConnectionStatusSchema>;

// MDX component props interfaces
export interface MDXRendererProps {
  source: string;
  components?: Record<string, React.ComponentType<any>>;
  options?: {
    parseFrontmatter?: boolean;
    scope?: Record<string, any>;
  };
}

export interface MermaidRendererProps {
  code: string;
  className?: string;
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
  zoomable?: boolean;
  pannable?: boolean;
  maxZoom?: number;
  minZoom?: number;
}

export interface PDFViewerProps {
  src: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  embedded?: boolean;
  downloadable?: boolean;
  viewMode?: 'inline' | 'modal' | 'external';
  showToolbar?: boolean;
  initialPage?: number;
  fallbackText?: string;
}

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  aspectRatio?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export interface CodeBlockProps {
  children: string;
  className?: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  filename?: string;
}

export interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  external?: boolean;
  download?: boolean;
}

// Service interfaces
export interface ProjectService {
  getAllProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project>;
  getHardcodedProjects(): Promise<Project[]>;
  getFileBasedProjects(): Promise<Project[]>;
  getProjectsByStatus(status: string): Promise<Project[]>;
  getProjectsByTag(tag: string): Promise<Project[]>;
}

export interface BlogService {
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost>;
  validateNotionConnection(): Promise<boolean>;
  getConnectionStatus(): Promise<ConnectionStatus>;
  refreshCache(): Promise<void>;
}