import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Saksham Adhikari — Inference Engineer at AskSLM, former TPU Cloud Researcher at Google. Resume, professional summary, and contact information.",
  alternates: {
    canonical: "https://saksham.us/about",
  },
  openGraph: {
    title: "About | Saksham Adhikari",
    description:
      "Inference Engineer at AskSLM | Former TPU Cloud Researcher at Google | AI Researcher & Full-Stack Developer",
    url: "https://saksham.us/about",
    type: "profile",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
