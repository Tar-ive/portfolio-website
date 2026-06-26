# Promptetheus Launch — June 20, 2026

## What

**Promptetheus** is a recursive self-improving tracing stack for AI agents. It provides incident response for production AI agents: observing failures, detecting root causes, and auto-generating fixes.

Built at the **UC Berkeley AI Hackathon 2026** (developer-tool track).

**Team**: Kuldeep D., Owen F., Kusum S., Saksham A.

## Stats

- 24 GitHub stars
- 3 Product Hunt upvotes
- Launched June 20, 2026

## Links

| Resource | URL |
|----------|-----|
| Product Hunt | https://www.producthunt.com/products/promptethus |
| Launch Video (YouTube) | https://www.youtube.com/watch?v=s41WnOceXRM |
| Substack Post | https://substack.com/@adhsaksham/note/p-203638310 |
| GitHub (service) | https://github.com/obro79/promptetheus-service |
| GitHub (main) | https://github.com/obro79/promptetheus |

## The Loop

Promptetheus runs a six-step failure-to-fix loop:

1. **Observe** — capture messages, tool calls, browser actions, state changes, latency, errors, replay artifacts
2. **Detect** — classify failures: goal mismatch, false success, policy contradiction, ignored warnings
3. **Replay** — show the exact session with event timeline and screen/video evidence
4. **Attribute** — point to the critical step and explain root cause
5. **Fix** — package the incident into a fix brief, patch target, GitHub PR, or deterministic fallback
6. **Prevent** — re-run the original bad step as a regression replay with before/after evidence

## Architecture

- **FastAPI** — trace write gateway for ingestion
- **Supabase** (Postgres + Auth + Storage) — canonical backend with workspace isolation
- **Next.js** — console for replay, incidents, docs, settings, logs, demo
- **Redis** — warm memory for vector similarity search
- **MCP Server** — Model Context Protocol integration for AI agents
