# Project Structure

## Root Directory
- **app/**: Next.js App Router pages and layouts
- **components/**: Reusable React components
- **lib/**: Utility functions and API integrations
- **public/**: Static assets (images, videos, icons)
- **hooks/**: Custom React hooks
- **styles/**: Global CSS files
- **scripts/**: Build and utility scripts

## App Directory (Next.js App Router)
```
app/
├── layout.tsx          # Root layout with navigation
├── page.tsx           # Homepage (portfolio)
├── globals.css        # Global styles and CSS variables
├── blog/
│   ├── page.tsx       # Blog listing page
│   └── [slug]/
│       └── page.tsx   # Individual blog post pages
```

## Components Organization
```
components/
├── ui/                # shadcn/ui components (accordion, button, card, etc.)
├── nav.tsx           # Main navigation component
├── video-preview.tsx # Video player component
├── twitter-embed.tsx # Social media integration
├── mdx-component.tsx # MDX content rendering
└── code-sandbox.tsx  # Code preview component
```

## Library Structure
```
lib/
├── utils.ts          # Utility functions (cn helper)
├── notion.ts         # Notion API wrapper
└── notion/
    ├── index.ts      # Main Notion integration
    └── rpc.ts        # Notion RPC client
```

## Media Management
- **public/media/**: All project images, videos, and assets
- **Cloudinary integration**: For optimized media delivery
- **Custom upload script**: `scripts/upload-media.ts`

## Styling Architecture
- **Tailwind CSS**: Utility-first approach
- **CSS Variables**: HSL-based color system in `app/globals.css`
- **Component variants**: Using `class-variance-authority`
- **Responsive design**: Mobile-first breakpoints

## Key Patterns
- **Server Components**: Default for data fetching
- **Client Components**: Marked with "use client" for interactivity
- **Suspense boundaries**: For loading states
- **Error boundaries**: Graceful error handling
- **Path aliases**: `@/` points to project root