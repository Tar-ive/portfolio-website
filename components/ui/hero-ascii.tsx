'use client'

import { useEffect } from 'react'

interface HeroAsciiProps {
  projectId?: string
  className?: string
}

/**
 * Lightweight wrapper around a Unicorn Studio ASCII canvas.
 * Injects the Unicorn runtime once, strips built-in branding,
 * and exposes a responsive container for custom layouts.
 */
export default function HeroAscii({ projectId = 'whwOGlfJ5Rz2rHaEUgHl', className }: HeroAsciiProps) {
  useEffect(() => {
    const bootstrapScript = document.createElement('script')
    bootstrapScript.type = 'text/javascript'
    bootstrapScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `
    document.head.appendChild(bootstrapScript)

    const brandingStyle = document.createElement('style')
    brandingStyle.textContent = `
      [data-us-project] { position: relative !important; overflow: hidden !important; }
      [data-us-project] canvas { clip-path: inset(0 0 10% 0) !important; }
      [data-us-project] * { pointer-events: none !important; }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    `
    document.head.appendChild(brandingStyle)

    const hideBranding = () => {
      const root = document.querySelector('[data-us-project]')
      if (!root) return
      root.querySelectorAll('*').forEach((el) => {
        const text = (el.textContent || '').toLowerCase()
        if (text.includes('unicorn') || text.includes('made with')) {
          el.remove()
        }
      })
    }

    hideBranding()
    const interval = setInterval(hideBranding, 100)
    const timers = [
      setTimeout(hideBranding, 1000),
      setTimeout(hideBranding, 3000),
      setTimeout(hideBranding, 5000),
    ]

    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
      document.head.removeChild(bootstrapScript)
      document.head.removeChild(brandingStyle)
    }
  }, [])

  return (
    <div className={className}>
      <div data-us-project={projectId} className="h-full w-full" />
    </div>
  )
}
