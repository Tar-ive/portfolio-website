# saksham.us

Next.js 15 + Tailwind 4. One page: hero, metrics with a live GitHub calendar,
an experience timeline, decks for projects and hackathon wins, research,
education with a scroll-driven coursework drum, and contact.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm start
npm run typecheck
npm run check      # asset + data references in the archived stream
```

## Files

| Path | What it is |
| --- | --- |
| `content/v3.ts` | **all page content** — edit this to change the site |
| `app/page.tsx` | the page, section by section |
| `app/globals.css` | design tokens, glass, sweep, bloom, sky |
| `components/v3/` | nav, hero, metrics, timeline, decks, research, education, contact, sky, kites |
| `public/media/saksham.jpg` | the hero portrait |
| `public/resume.pdf` | the compiled resume, linked from the hero |
| `resume/resume.tex` | its source |
| `legacy/` | the retired stream, kept so it can be revived |

## Resume

```bash
cd resume && tectonic -X compile resume.tex --outdir .
cp resume.pdf ../public/resume.pdf
```

It has to stay one page — the log line (`Output written on resume.xdv (1 page…)`)
is the check. Margins are already thin; trim content before loosening them.

## Deploy

Vercel builds the app and serves it at saksham.us. `vercel deploy` for a
preview, `vercel deploy --prod` for production.

## Notes

- The GitHub contribution graph reads
  `github-contributions-api.jogruber.de` live in the browser. No token, no
  backend; it degrades to a link if the API is down.
- The contact form composes a `mailto:` — nothing is posted to a server.
- `/v3`, the address the page had while the stream still ran, redirects home.
