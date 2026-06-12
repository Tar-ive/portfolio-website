# saksham.us — the stream

Static site. No build step: React + Babel run in the browser.

## Deploy (Vercel)
1. Copy the contents of this folder into the repo root (Tar-ive/portfolio-website).
2. `git add -A && git commit -m "the stream" && git push origin main`
3. Vercel serves index.html at the root — saksham.us DNS unchanged.

## Files
- index.html — entry
- stream-app.jsx — UI (compiled in-browser by Babel)
- stream-data.js — ALL content lives here; edit this to add items
- _ds/ — design system (tokens, components.css, component bundle)

## Notes
- Twitter/X videos hotlink video.twimg.com — consider downloading the 3 MP4s
  into /media and pointing stream-data.js at them.
- X embeds load from platform.twitter.com at runtime.
