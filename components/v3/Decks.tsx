"use client";

import { Deck, type DeckCard } from "@/components/v3/Deck";
import { FeaturedProject } from "@/components/v3/FeaturedProject";
import { hackathons, projects, sections } from "@/content/v3";

const projectCards: DeckCard[] = projects.map((project) => ({
  id: project.id,
  title: project.title,
  note: project.status,
  summary: project.summary,
  tech: project.tech,
  links: project.links,
}));

const hackathonCards: DeckCard[] = hackathons.map((win) => ({
  id: win.id,
  title: win.title,
  eyebrow: win.event,
  note: win.award,
  summary: win.summary,
  tech: win.tech,
  links: win.links,
}));

export function ProjectDeck() {
  return (
    <Deck
      id="projects"
      kicker="$ ls ~/projects"
      title={sections.projects.title}
      items={projectCards}
      lead={<FeaturedProject />}
    />
  );
}

export function HackathonDeck() {
  return (
    <Deck
      id="hackathons"
      kicker="$ ls ~/wins"
      title={sections.hackathons.title}
      description={sections.hackathons.description}
      items={hackathonCards}
      icon="trophy"
    />
  );
}
