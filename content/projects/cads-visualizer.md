---
title: "CADS Research Visualization System"
subtitle: "Semantic analytics platform for Texas State University's research ecosystem"
date: "2025-01-20"
status: "completed"
tags: ["Data Visualization", "OpenAlex", "Python", "Supabase", "UMAP", "HDBSCAN", "Research Data"]
github: "https://github.com/Tar-ive/CADS-Visualizer"
image: "/media/cads-visualizer.png"
pinned: true
category: "data-platform"
affiliations:
  - name: "National Science Foundation"
    url: "https://www.nsf.gov/awardsearch/showAward?AWD_ID=2334268"
    logo: "https://docs.gato.txst.edu/707063/w/362/mOGpRnFPTsPB/NSF.svg"
    description: "Award Abstract # 2334268 CAP initiative supporting AI curriculum and infrastructure at Texas State University"
priority: 96
---

# CADS Research Visualization System

Semantic analytics pipeline that turns faculty publication data into interactive visual maps for the Texas State research community.

## Snapshot
- Automated ingestion from OpenAlex + Supabase, clustering 2,400+ publications into thematic groups.
- UMAP + HDBSCAN embeddings surface collaboration hotspots and cross-department opportunities.
- Streamlit dashboard and monitoring suite give CADS leadership live health metrics on ingest jobs.

## Architecture

```
CADS Research Visualization System
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Data Sources  │    │   Core Pipeline  │    │   Visualization │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ • OpenAlex API  │───▶│ • Data Loader    │───▶│ • Web Dashboard │
│ • Supabase DB   │    │ • Embeddings     │    │ • Search System │
│ • CADS Faculty  │    │ • UMAP/HDBSCAN   │    │ • Interactive   │
│ • Research Data │    │ • Theme Gen      │    │   Visualizations│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Why It Matters
- Cuts hours of manual grant scouting by exposing real-time semantic search and profile matching.
- Provides reproducible analytics—CI runs tests on ingest scripts, and monitoring catches schema drift before faculty demos.
- NSF CAP award showcases the system as the backbone for expanding AI curriculum across campus.

## Stack & Operations
- Python ingestion workers (Poetry + Airflow-ready scripts) writing into Supabase vector tables.
- Visualization layer served from a hardened `visuals/public` bundle with CDNs for department-wide access.
- Documentation set spans pipeline playbooks, troubleshooting guides, and CI/CD runbooks so new CADS hires can onboard in a day.
