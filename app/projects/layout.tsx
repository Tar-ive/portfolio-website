import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of Saksham Adhikari's work spanning AI/ML applications, web development, and research projects — from hackathon wins to production applications.",
  alternates: {
    canonical: "https://saksham.us/projects",
  },
  openGraph: {
    title: "Projects | Saksham Adhikari",
    description:
      "AI/ML projects, web applications, and research by Saksham Adhikari. Including Grants-MCP, QuantaFold, and more.",
    url: "https://saksham.us/projects",
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
