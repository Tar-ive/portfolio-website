---
title: "NSF Grant Matching Engine"
subtitle: "AI-assisted researcher team assembly for NSF solicitations"
date: "2025-02-05"
status: "completed"
tags: ["NSF", "Grant Matching", "Streamlit", "NLP", "Vector Search", "AI Planning", "Python"]
github: "https://github.com/Tar-ive/nsf-grant-matching-engine"
image: "/media/nsf-grant-matching.png"
paper: "https://drive.google.com/file/d/1M8Zlwd-v11vO6RNTy356XSi8xGOs7ADA/view"
paperLabel: "Read Paper"
category: "ai-research"
priority: 93
---

# 🔬 AI-Powered NSF Grant Matching Engine

End-to-end system that parses NSF calls, scores researcher fit, and assembles “dream teams” in minutes instead of weeks.

## Key Outcomes
- 78% reduction in team assembly time; 23% uplift in skill coverage vs. manual picks.
- 100% accuracy on eligibility checks by combining rule parsing + semantic filters.
- Production Streamlit front-end so research offices can search solicitations and export briefs instantly.

## System Architecture

```mermaid
graph TD
    subgraph "Phase 0: Intelligent Pre-processing"
        A[OpenAlex API Data] --> B[Expertise Profile Processor]
        B --> C[Researcher Profile Datastore]
        D[Solicitation Upload] --> E[Intelligent Solicitation Parser]
        E --> F[Structured Solicitation Object]
        F --> G[Solicitation Datastore]
    end

    subgraph "Phase 1: Core Analysis Engine"
        C --> H[Hybrid Search & Evidence Engine]
        G --> H
        H --> I[TF-IDF Analysis]
        H --> J[Vector Similarity Analysis]
        I --> K[Academic Expertise Score]
        J --> K
        K --> L[Grant Experience Amplification]
        L --> M[Final Affinity Matrix]
    end

    subgraph "Phase 2: Strategic Team Assembly"
        M --> N[Dream Team Greedy Algorithm]
        N --> O[Eligibility & Constraint Validation]
        O --> P[Coverage Score Calculation]
        P --> Q[Gap Analysis Agent LLM]
        Q --> R[Strategic Report Generation]
    end
```

## What Runs Under the Hood
- TF‑IDF + dense embeddings blend to score expertise, with logarithmic boosts for past NSF wins.
- Constraint engine checks PI eligibility, institutional caps, and collaboration history before finalizing rosters.
- LLM-powered gap analysis crafts stakeholder-ready reports highlighting risks, mitigations, and go/no-go.

## Delivery & Ops
- Python + Streamlit app deployable on campus infrastructure; uses uv/poetry for reproducible environments.
- Pydantic data contracts and pytest suite guard parsing edge cases across PDF formats.
- Tutorials walk grant offices through one-click ingest, team review, and export workflows.
