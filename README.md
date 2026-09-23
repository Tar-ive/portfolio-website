# saksham.us

Two sites in one deployment.

- **`/` — the stream.** The original no-build site: React + Babel compiled in the
  browser, all content in one data file. It lives in `public/` and is served
  untouched; `next.config.mjs` rewrites `/` to `public/index.html`.
- **`/v3` — the portfolio.** Next.js 15 + Tailwind 4, sections for experience,
  projects, research, education and contact, in the same warm paper and
  vermillion palette as the stream.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000/v3 and http://localhost:3000/
npm run build      # production build
npm start          # serve the build
npm run typecheck
npm run check      # asset + data references in the stream
```

## Files

| Path | What it is |
| --- | --- |
| `app/v3/page.tsx` | the /v3 page, section by section |
| `app/globals.css` | design tokens, glass, sweep, bloom, background wash |
| `components/v3/` | nav, hero, metrics, timeline, carousel, research, education, contact |
| `content/v3.ts` | **all /v3 content** — edit this to change the page |
| `public/index.html` | the stream's entry point |
| `public/stream-data.js` | **all stream content** |
| `public/_ds/` | the stream's design system |
| `scripts/check-site.mjs` | fails the build on a broken asset or id in the stream |

## Deploy

Vercel builds the Next app and serves both pages. `vercel deploy` for a
preview, `vercel deploy --prod` for saksham.us.

## Notes

- The GitHub contribution graphs on both pages read
  `github-contributions-api.jogruber.de` live in the browser. No token, no
  backend; both degrade to a link if the API is down.
- The /v3 contact form composes a `mailto:` — nothing is posted to a server.
