let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint and TypeScript checking enabled for production safety
  eslint: {
    // Only ignore during builds if there are non-critical warnings
    // ignoreDuringBuilds: false, // Default behavior - keep linting active
  },
  typescript: {
    // TypeScript errors will now fail the build (production-safe)
    // ignoreBuildErrors: false, // Default behavior - keep type checking active
  },
  images: {
    // Enable image optimization for better performance
    unoptimized: false,
    domains: ['res.cloudinary.com'], // Allow Cloudinary images
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig