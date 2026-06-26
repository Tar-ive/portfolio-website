# SEO Optimizations — June 2026

## Changes Made

### 1. Meta Tags (index.html)

- **Title**: Updated from generic `saksham — the stream` to keyword-rich `Saksham Adhikari — ML/AI Engineer | The Stream`
- **Description**: Added a 160-character meta description covering key skills, roles, and projects
- **Keywords**: Added meta keywords targeting `Saksham Adhikari`, `ML engineer`, `AI engineer`, `Promptetheus`, `Grants-MCP`, etc.
- **Author**: Added `<meta name="author">`
- **Canonical URL**: Added `<link rel="canonical" href="https://saksham.us/">`

### 2. Open Graph Tags

Added full Open Graph metadata (`og:type`, `og:title`, `og:description`, `og:url`, `og:site_name`) for rich link previews on Facebook, LinkedIn, Discord, Slack, etc.

### 3. Twitter Card Tags

Added Twitter Card metadata (`twitter:card`, `twitter:site`, `twitter:creator`, `twitter:title`, `twitter:description`) for rich previews when links are shared on X/Twitter.

### 4. JSON-LD Structured Data

Added two JSON-LD blocks:

- **Person schema**: Name, job title, education, employers, skills, and social profile links (sameAs). This helps Google's Knowledge Panel and AI assistants understand who Saksham is.
- **SoftwareApplication schema**: Promptetheus as a developer tool with description, repository link, and publish date. This helps search engines and AI agents surface the project.

### 5. robots.txt

Created `robots.txt` allowing all crawlers and pointing to the sitemap:
```
User-agent: *
Allow: /
Sitemap: https://saksham.us/sitemap.xml
```

### 6. sitemap.xml

Created a basic XML sitemap with the homepage entry, `lastmod` date, and weekly `changefreq`.

### 7. llms.txt

Created `llms.txt` — a convention for AI agent discoverability. Contains a structured summary of who Saksham is, current projects (Promptetheus, TwoBot, Grants-MCP), and links. This helps LLM-based search agents and AI assistants discover and describe the site accurately.

## Why These Matter

- **Meta tags + OG/Twitter**: Control how the site appears in search results and social shares
- **JSON-LD**: Helps Google build a knowledge graph entry; improves rich snippets
- **robots.txt + sitemap**: Ensures crawlers index the site properly
- **llms.txt**: Emerging standard for AI agent discoverability (similar to robots.txt for LLMs)
