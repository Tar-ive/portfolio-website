# Technology Stack

## Framework & Runtime
- **Next.js 14+**: React framework with App Router
- **React 18**: UI library with hooks and modern patterns
- **TypeScript**: Primary language for type safety
- **Node.js**: Runtime environment

## Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Icon library
- **CSS Variables**: For theming with HSL color system

## Key Libraries
- **@notionhq/client**: Notion API integration for blog content
- **react-hook-form + zod**: Form handling and validation
- **class-variance-authority**: Component variant management
- **tailwind-merge + clsx**: Conditional CSS class handling
- **react-twitter-embed**: Social media integration
- **vidstack**: Video player component
- **cloudinary**: Media management and optimization

## Development Tools
- **ESLint**: Code linting (build errors ignored in config)
- **PostCSS**: CSS processing
- **ts-node**: TypeScript execution for scripts

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Media Management
npm run upload-media # Upload media files using custom script
```

## Build Configuration
- **Vercel deployment**: Optimized for Vercel platform
- **Image optimization**: Disabled for static export compatibility
- **Webpack optimizations**: Parallel builds and worker threads enabled
- **TypeScript/ESLint**: Build errors ignored for rapid development