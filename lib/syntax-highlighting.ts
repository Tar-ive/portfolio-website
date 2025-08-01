import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from 'shiki';

let highlighter: Highlighter | null = null;

// Supported languages for syntax highlighting
const SUPPORTED_LANGUAGES: BundledLanguage[] = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'java',
  'go',
  'rust',
  'cpp',
  'c',
  'bash',
  'shell',
  'json',
  'yaml',
  'markdown',
  'html',
  'css',
  'sql',
  'dockerfile',
  'mermaid',
];

// Theme configuration
const THEMES: { light: BundledTheme; dark: BundledTheme } = {
  light: 'github-light',
  dark: 'github-dark',
};

/**
 * Initialize the syntax highlighter with required languages and themes
 */
export async function initializeHighlighter(): Promise<Highlighter> {
  if (highlighter) {
    return highlighter;
  }

  try {
    highlighter = await createHighlighter({
      themes: [THEMES.light, THEMES.dark],
      langs: SUPPORTED_LANGUAGES,
    });
    
    return highlighter;
  } catch (error) {
    console.error('Failed to initialize syntax highlighter:', error);
    throw error;
  }
}

/**
 * Highlight code with the specified language and theme
 */
export async function highlightCode(
  code: string,
  language: string,
  theme: 'light' | 'dark' = 'light'
): Promise<string> {
  try {
    const hl = await initializeHighlighter();
    
    // Check if language is supported, fallback to 'text' if not
    const lang = SUPPORTED_LANGUAGES.includes(language as BundledLanguage) 
      ? (language as BundledLanguage)
      : 'text';
    
    return hl.codeToHtml(code, {
      lang,
      theme: THEMES[theme],
    });
  } catch (error) {
    console.error('Failed to highlight code:', error);
    // Return plain code wrapped in pre/code tags as fallback
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

/**
 * Extract language from className (e.g., "language-javascript" -> "javascript")
 */
export function extractLanguage(className?: string): string {
  if (!className) return 'text';
  
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : 'text';
}

/**
 * Check if a language is supported for syntax highlighting
 */
export function isLanguageSupported(language: string): boolean {
  return SUPPORTED_LANGUAGES.includes(language as BundledLanguage);
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): BundledLanguage[] {
  return [...SUPPORTED_LANGUAGES];
}

/**
 * Escape HTML characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Configuration for MDX rehype plugins
 */
export const rehypeHighlightConfig = {
  theme: {
    light: THEMES.light,
    dark: THEMES.dark,
  },
  langs: SUPPORTED_LANGUAGES,
};

/**
 * Detect if code block contains Mermaid diagram
 */
export function isMermaidCode(code: string, language?: string): boolean {
  if (language === 'mermaid') return true;
  
  // Check for common Mermaid diagram types
  const mermaidPatterns = [
    /^\s*graph\s+(TB|TD|BT|RL|LR)/,
    /^\s*sequenceDiagram/,
    /^\s*classDiagram/,
    /^\s*stateDiagram/,
    /^\s*erDiagram/,
    /^\s*journey/,
    /^\s*gantt/,
    /^\s*pie/,
    /^\s*flowchart/,
  ];
  
  return mermaidPatterns.some(pattern => pattern.test(code));
}