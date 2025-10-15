---
title: "Prime Environments • DeepResearch Agent Suite"
subtitle: "Multi-tool RL evaluation environment with task-aware LLM rubrics"
date: "2025-10-15"
status: "currently-building"
tags: ["Reinforcement Learning", "Agent Evaluation", "Tool Use", "LLM", "Prime Environments"]
github: "https://github.com/PrimeIntellect-ai/prime-environments/pull/205"
image: "/media/deepresearch-environment.png"
affiliations:
  - name: "Prime Intellect"
    url: "https://github.com/PrimeIntellect-ai"
    logo: "https://avatars.githubusercontent.com/u/148051844?s=200&v=4"
    description: "Prime Environments open-source agent evaluation collective"
category: "ai-research"
priority: 90
---

# DeepResearch Environment for Prime Environments

I shipped a production-ready **deepresearch** environment to the Prime Environments open-source evaluation suite. The work landed the official bounty and is now the reference environment for research-style tasks that blend tool use, web reasoning, and code execution.

## Why it Matters
- Extends Prime Environments beyond pure coding puzzles into **multi-modal research workflows**
- Establishes **task-aware scoring** so short-form QA and long-form synthesis are graded fairly
- Demonstrates competitive agent performance against the new rubric, unlocking higher difficulty tiers for the benchmark

## Core Contributions
- **Task-aware rubric system** with binary accuracy for short-form tasks and weighted factuality/writing scores for long responses
- **Three integrated tools** exposed through the environment API: Exa-powered web search, markdown-based page browsing, and a sandboxed Python interpreter
- **Dataset variants** for demo, short-form, long-form, and tool stress tests so agent builders can target specific capabilities
- **Judge prompt redesign** that eliminates trivial perfect scores and surfaces realistic reward distributions (0.0, 0.94, 1.0)

## Usage Highlights
```bash
# Run the demo workflow
uv run vf-eval deepresearch -m gpt-4.1-mini

# Focus on research prompts
dataset_variant=long_form

# Swap judge models
uv run vf-eval deepresearch -m gpt-4.1-mini \
  -a '{"judge_model":"gpt-4.1","judge_base_url":"https://api.openai.com/v1"}'
```

## Bounty Outcome
- ✅ **Prime Environments bounty winner** for expanding the ecosystem with a deep research setting
- ✅ Adopted as an official environment for future Prime Intellect evaluations
- ✅ Recognized for raising the difficulty bar while keeping reproducible scoring

The full implementation lives in [PR #205](https://github.com/PrimeIntellect-ai/prime-environments/pull/205) with extensive documentation and tests covering the new agents, tools, and reward models.
