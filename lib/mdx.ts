import { compileMDX } from 'next-mdx-remote/rsc';
import { ProjectFrontmatterSchema, BlogPostSchema } from './types';
import { z } from 'zod';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { serverComponents } from '@/components/mdx/server-components';


// MDX compilation options
const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor-link'],
          },
        },
      ] as any,
    ],
  },
};

/**
 * Compile MDX content with frontmatter parsing
 */
export async function compileMDXWithFrontmatter<T extends z.ZodSchema>(
  source: string,
  frontmatterSchema: T,
  components?: Record<string, React.ComponentType<any>>,
  compileContent: boolean = true
): Promise<{
  content?: React.ReactElement;
  frontmatter: z.infer<T>;
  readingTime: number;
  wordCount: number;
}> {
  try {
    let content: React.ReactElement | undefined;
    let frontmatter: any;

    if (compileContent) {
      const mergedComponents = {
        ...serverComponents,
        ...components,
      };
      
      console.log('MDX compilation:', {
        componentsCount: Object.keys(mergedComponents).length,
        hasCodeComponent: !!mergedComponents.code,
        hasPreComponent: !!mergedComponents.pre,
        componentKeys: Object.keys(mergedComponents)
      });
      
      const result = await compileMDX({
        source,
        components: mergedComponents,
        options: {
          parseFrontmatter: true,
          ...mdxOptions,
        },
      });
      
      content = result.content;
      frontmatter = result.frontmatter;
    } else {
      // Only extract frontmatter without compiling content
      frontmatter = extractFrontmatter(source);
      if (!frontmatter) {
        throw new Error('No frontmatter found in source');
      }
    }

    // Validate frontmatter with provided schema
    const validatedFrontmatter = frontmatterSchema.parse(frontmatter);
    
    // Calculate reading time and word count
    const plainText = source.replace(/---[\s\S]*?---/, '').replace(/[#*`]/g, '');
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Assume 200 words per minute

    return {
      content,
      frontmatter: validatedFrontmatter,
      readingTime,
      wordCount,
    };
  } catch (error) {
    console.error('MDX compilation error:', error);
    throw new Error(`Failed to compile MDX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Compile project MDX content
 */
export async function compileProjectMDX(
  source: string,
  components?: Record<string, React.ComponentType<any>>
) {
  return compileMDXWithFrontmatter(source, ProjectFrontmatterSchema, components);
}

/**
 * Compile blog post MDX content (for remote content from Notion)
 */
export async function compileBlogMDX(
  source: string,
  components?: Record<string, React.ComponentType<any>>
) {
  try {
    const mergedComponents = {
      ...serverComponents,
      ...components,
    };
    
    const { content } = await compileMDX({
      source,
      components: mergedComponents,
      options: mdxOptions,
    });

    // Calculate reading time and word count
    const plainText = source.replace(/[#*`]/g, '');
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      content,
      readingTime,
      wordCount,
    };
  } catch (error) {
    console.error('Blog MDX compilation error:', error);
    throw new Error(`Failed to compile blog MDX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract frontmatter from MDX source without compiling
 */
export function extractFrontmatter(source: string): Record<string, any> | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = source.match(frontmatterRegex);
  
  if (!match) return null;
  
  try {
    // Simple YAML-like parsing for frontmatter
    const frontmatterText = match[1];
    const frontmatter: Record<string, any> = {};
    
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Parse arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          frontmatter[key] = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
          return;
        }
        
        // Parse booleans
        if (value === 'true') {
          frontmatter[key] = true;
          return;
        }
        if (value === 'false') {
          frontmatter[key] = false;
          return;
        }
        
        frontmatter[key] = value;
      }
    });
    
    return frontmatter;
  } catch (error) {
    console.error('Failed to parse frontmatter:', error);
    return null;
  }
}

/**
 * Remove frontmatter from MDX source
 */
export function removeFrontmatter(source: string): string {
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n?/;
  return source.replace(frontmatterRegex, '');
}

/**
 * Generate table of contents from MDX content
 */
export function generateTableOfContents(source: string): Array<{
  id: string;
  title: string;
  level: number;
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: Array<{ id: string; title: string; level: number }> = [];
  
  let match;
  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    toc.push({ id, title, level });
  }
  
  return toc;
}

/**
 * Validate MDX syntax without compiling
 */
export function validateMDXSyntax(source: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for unclosed code blocks
  const codeBlockRegex = /```/g;
  const codeBlocks = source.match(codeBlockRegex);
  if (codeBlocks && codeBlocks.length % 2 !== 0) {
    errors.push('Unclosed code block detected');
  }
  
  // Check for malformed frontmatter
  const frontmatterMatches = source.match(/^---/gm);
  if (frontmatterMatches && frontmatterMatches.length === 1) {
    errors.push('Unclosed frontmatter block');
  }
  
  // Check for malformed links
  const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(source)) !== null) {
    if (!linkMatch[2] || linkMatch[2].trim() === '') {
      errors.push(`Empty link URL for text: "${linkMatch[1]}"`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}