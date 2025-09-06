import { readFile } from 'fs/promises';
import { join } from 'path';
import { ProjectFrontmatterSchema } from '@/lib/types';
import { compileProjectMDX } from '@/lib/mdx';
import { defaultComponents } from '@/components/mdx/default-components';
import dynamic from 'next/dynamic';

const SimpleMermaid = dynamic(() => import('@/components/mdx/simple-mermaid'), {
  ssr: false,
  loading: () => <div>Loading Mermaid...</div>,
});

export default async function TestMDXPage() {
  try {
    // Read the test project file
    const filePath = join(process.cwd(), 'content/projects/test-project.md');
    const source = await readFile(filePath, 'utf8');
    
    // Compile the MDX content using our utility function with custom components
    const { content, frontmatter, readingTime, wordCount } = await compileProjectMDX(source, defaultComponents);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Project metadata */}
          <div className="mb-8 p-6 bg-muted rounded-lg">
            <h1 className="text-2xl font-bold mb-2">{frontmatter.title}</h1>
            {frontmatter.subtitle && (
              <p className="text-muted-foreground mb-4">{frontmatter.subtitle}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {frontmatter.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Status: {frontmatter.status}</p>
              <p>Reading time: {readingTime} min</p>
              <p>Word count: {wordCount}</p>
            </div>
          </div>
          
          {/* Test Simple Mermaid directly */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Direct Mermaid Test</h2>
            <SimpleMermaid 
              code={`graph TB
    A[User Input] --> B[Validation]
    B --> C{Valid?}
    C -->|Yes| D[Process Data]
    C -->|No| E[Show Error]
    D --> F[Save to Database]
    F --> G[Return Success]
    E --> H[Return Error]`}
            />
          </div>
          
          {/* MDX content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {content}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering test MDX:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-destructive/10 border border-destructive rounded-lg">
            <h1 className="text-xl font-bold text-destructive mb-2">Error</h1>
            <p className="text-destructive">
              Failed to render MDX content: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}