import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Nav } from "@/components/nav"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://saksham.us"),
  title: {
    default: "Saksham Adhikari - AI Researcher & Inference Engineer",
    template: "%s | Saksham Adhikari",
  },
  description:
    "Saksham Adhikari is an Inference Engineer at AskSLM and former TPU Cloud Researcher at Google. Nepal-born, Texas-based AI/ML engineer studying Computer Information Systems at Texas State University with a 4.0 GPA.",
  keywords: [
    "Saksham Adhikari",
    "AI Researcher",
    "Inference Engineer",
    "AskSLM",
    "Google TPU",
    "Machine Learning",
    "Texas State University",
    "Full-Stack Developer",
    "Nepal",
    "Austin Texas",
    "ACM AI",
    "QuantaFold",
    "Grants-MCP",
  ],
  authors: [{ name: "Saksham Adhikari", url: "https://saksham.us" }],
  creator: "Saksham Adhikari",
  publisher: "Saksham Adhikari",
  alternates: {
    canonical: "https://saksham.us",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saksham.us",
    siteName: "Saksham Adhikari",
    title: "Saksham Adhikari - AI Researcher & Inference Engineer",
    description:
      "Inference Engineer at AskSLM | Former TPU Cloud Researcher at Google | 4.0 GPA at Texas State University | AI/ML, NLP, Full-Stack Development",
    images: [
      {
        url: "/media/profile_p.jpeg",
        width: 400,
        height: 400,
        alt: "Saksham Adhikari",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Saksham Adhikari - AI Researcher & Inference Engineer",
    description:
      "Inference Engineer at AskSLM | Former TPU Cloud Researcher at Google | 4.0 GPA at Texas State University",
    creator: "@saksham_adh",
    images: ["/media/profile_p.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Saksham Adhikari",
  url: "https://saksham.us",
  image: "https://saksham.us/media/profile_p.jpeg",
  jobTitle: "Inference Engineer",
  worksFor: {
    "@type": "Organization",
    name: "AskSLM",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Texas State University",
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Natural Language Processing",
    "TPU Optimization",
    "Full-Stack Development",
    "Python",
    "JavaScript",
    "TypeScript",
  ],
  sameAs: [
    "https://www.linkedin.com/in/adhsaksham/",
    "https://github.com/Tar-ive",
    "https://x.com/saksham_adh",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Austin",
    addressRegion: "TX",
    addressCountry: "US",
  },
  nationality: {
    "@type": "Country",
    name: "Nepal",
  },
  description:
    "Nepal-born, Texas-based AI/ML engineer. Inference Engineer at AskSLM, former TPU Cloud Researcher at Google. 4.0 GPA Computer Information Systems student at Texas State University.",
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Saksham Adhikari",
  url: "https://saksham.us",
  description:
    "Personal portfolio and blog of Saksham Adhikari — AI researcher, inference engineer, and full-stack developer.",
  author: {
    "@type": "Person",
    name: "Saksham Adhikari",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="canonical" href="https://saksham.us" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-white`}>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}

