import dynamic from "next/dynamic"
import Image from "next/image"
import type { Components } from "react-markdown"
import { cn } from "@/lib/utils"
import { getCloudinaryUrl } from '@/lib/cloudinary'
import { mediaMap } from '@/lib/media'

const CodeSandbox = dynamic(() => import("./code-sandbox"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-32 bg-muted rounded-lg" />,
})

export const mdxComponents: Components = {
  // Handle images
  img: (props) => {
    // Get the filename without extension
    const filename = props.src?.split('/').pop()?.split('.')[0]
    // Convert filename to camelCase to match mediaMap keys
    const mediaKey = filename?.replace(/-./g, x => x[1].toUpperCase()) as keyof typeof mediaMap
    
    return (
      <Image
        src={getCloudinaryUrl(mediaMap[mediaKey] || '')}
        alt={props.alt || ""}
        width={800}
        height={400}
        className="rounded-lg shadow-md"
      />
    )
  },

  // Style code blocks
  pre: ({ children, ...props }) => (
    <pre className="relative rounded-lg bg-[#1e2937] p-4 overflow-x-auto" {...props}>
      {children}
    </pre>
  ),

  // Handle code blocks and inline code
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    const code = String(children).trim()

    // Handle JSX code blocks
    if (match?.[1] === "jsx" && !inline) {
      return <CodeSandbox code={code} />
    }

    // Regular code blocks
    if (!inline) {
      return (
        <code className={cn("text-sm font-mono text-gray-200", className)} {...props}>
          {children}
        </code>
      )
    }

    // Inline code
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium"
        {...props}
      >
        {children}
      </code>
    )
  },

  // Style paragraphs
  p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,

  // Style headings
  h1: ({ children }) => (
    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>
  ),

  // Style lists
  ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,

  // Style blockquotes
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-primary pl-6 italic">{children}</blockquote>
  ),
}
