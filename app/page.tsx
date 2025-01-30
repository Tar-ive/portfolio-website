"use client"

import { Github, Globe, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoPreview } from "@/components/video-preview"
import { Separator } from "@/components/ui/separator"
import { TwitterTweetEmbed } from "react-twitter-embed"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
//import { getCloudinaryUrl, getCloudinaryVideoUrl } from "@/lib/cloudinary"
//import { mediaMap } from "@/lib/media"

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 462.799" className={className}>
    <path
      fillRule="nonzero"
      d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
    />
  </svg>
)

const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto" style={{ maxWidth: "250px" }}>
    <div className="relative rounded-[2rem] border-4 border-black overflow-hidden bg-black">
      <div className="absolute top-0 inset-x-0 h-4 bg-black rounded-b-2xl z-10" />
      {children}
    </div>
  </div>
)

//const getMediaId = (project: string): keyof typeof mediaMap => {
//  const mapping: Record<string, keyof typeof mediaMap> = {
//    "Find&Fund": "findAndFund",
//    "Grants.gov MCP": "findAndFund",
//    "Research Assistant": "researchAi",
//    Obvius: "obvius",
//    "Enhanced Exa MCP Server": "exaMcp",
//    "Bobcat Bounty Inventory System": "bobcatBounty",
//    "TXST AI Academic Advisor": "aiAdvisor",
//    "Where Do I Park?": "whereDoIPark",
//    Echoz: "echoz",
//    "Business Ecosystem Simulator": "businessSimulator",
//    "Blackjack Q-Learning App": "blackjack",
//    "President's Economic Impact": "president",
//    "Credit Risk Prediction System": "creditDefault",
//    "Interactive SQL Query Application": "sqlQuery",
//  }

//  if (!mapping[project]) {
//    console.log(`No direct mapping found for project: ${project}`)
//  }

//  return mapping[project] || (project.toLowerCase().replace(/\s+/g, "") as keyof typeof mediaMap)
//}

//const getVideoId = (project: string): keyof typeof mediaMap => {
//  const mapping: Record<string, keyof typeof mediaMap> = {
//    "Find&Fund": "findAndFundVideo",
//    "Bobcat Bounty Inventory System": "bobcatBountyVideo",
//    "Research Assistant": "researchAiVideo",
//    Obvius: "obviusVideo",
//    "Grants.gov MCP": "mcpGrantsVideo",
//  }

//  if (!mapping[project]) {
//    console.log(`No direct video mapping found for project: ${project}`)
//  }

//  return mapping[project] || (`${project.toLowerCase().replace(/\s+/g, "")}Video` as keyof typeof mediaMap)
//}

export default function Portfolio() {
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  const achievements = [
    "Currently building <a href='https://x.com/obvius_site' class='text-blue-600 hover:underline'>Obvius </a> and a <a href='https://findandfund.vercel.app/' class='text-blue-600 hover:underline'>Find&Fund </a> which is looking for funding itself. ",
    "Developed <a href='https://where-do-i-park-tarive22.replit.app/' class='text-blue-600 hover:underline'>Where Do I Park?</a> - a real-time parking availability app, <a href='https://github.com/Tar-ive/exa-mcp-server' class='text-blue-600 hover:underline'>EXA Advanced MCP for Claude</a>, part of the Echoz team, <a href='https://bobcat-bounty-app-1-tarive22.replit.app/' class='text-blue-600 hover:underline'>Bobcat Bounty</a> website, <a href='https://txst-ai.vercel.app/' class='text-blue-600 hover:underline'>TXST AI Academic Advisor</a>",
    "Won multiple hackathons and competitions",
    "AI4ALL Ignite Accelerator Fellow",
    "Student Ambassador @ Extern",
    "Resident Assistant and Student at Texas State University",
    "Cracking Machine Learning Interviews as I speak",
    "Vice President at ACM AI @ TXST",
    "Involved in a Nepalese startup: <a href='https://internepal.com.np/' class='text-blue-600 hover:underline'>Intern Nepal</a>",
  ]

  const projects = [
    {
      title: "Find&Fund",
      subtitle: "Finding the right funding for the right research",
      description:
        "I am currently working to build a website which pairs the right researchers with the right funding oppurtunities. Also building a recommendation system to recommend grants personalized to the researcher. ",
      github: "https://github.com/Tar-ive/find-fund",
      live: "https://findandfund.vercel.app/",
      image: "media/find&fund.jpeg",
      video: "media/find&fund.mp4",
      date: "Currently Building",
      tags: ["EXA", "OpenAlex", "grants.gov", "Two-Tower Recommendation"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Grants.gov MCP",
      subtitle: "MCP for fetching grants data from grants.gov",
      description:
        "I recently built an MCP which lets Anthropic's Claude fetch grants data from grants.gov. Some key features: Search for grants by keyword, Paginate the search results, Display detailed info on each grant, including funding details, deadlines, and eligibility",
      github: "https://github.com/Tar-ive/grants-mcp",
      live: "https://x.com/saksham_adh/status/1870666381571600401",
      image: "media/grantsmcp.jpeg",
      video: "media/mcp-grants1.mp4",
      date: "Latest Project",
      tags: ["Claude", "MCP", "grants.gov"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Research Assistant",
      subtitle: "AI-powered research assistant",
      description: "Currently in development - An AI-powered research assistant application.",
      github: "https://github.com/Tar-ive/research-ai",
      live: "https://txst-research.streamlit.app/",
      image: "/media/research_ai.jpg",
      video: "/media/research_ai.webm",
      date: "Currently Building",
      tags: ["AI", "Research", "Streamlit", "Python"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Obvius",
      subtitle: "We take you places",
      description: "Obvius helps you plan your perfect day out and plans the itinerary for you too.",
      live: "https://obvius.site/",
      image: "/media/obvius.png",
      video: "/media/obvius_edited.mp4",
      date: "Currently Building",
      tags: ["Travel", "Planning", "AI"],
      xHandle: "obvius_site",
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
      pinned: true,
    },
    {
      title: "Enhanced Exa MCP Server",
      subtitle: "Neural search capabilities for LLMs",
      description:
        "This is an enhanced fork of the original Exa MCP server that provides neural search capabilities using the Exa API. The server enables Large Language Models (LLMs) to search and analyze both academic research papers and news articles with improved semantic understanding. New features include comprehensive results, enhanced result format, improved error handling, rich console output, and full TypeScript implementation.",
      github: "https://github.com/Tar-ive/exa-mcp-server.git",
      image: "/media/exa_mcp.png",
      date: "Latest Project",
      tags: ["TypeScript", "Neural Search", "LLM", "API"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Bobcat Bounty Inventory System",
      subtitle: "Real-time food pantry inventory tracking",
      description:
        "Developed during Hackacat Nano at Texas State University (7-hour hackathon), this project addresses food insecurity on campus through Bobcat Bounty, a student-run food pantry. The application features real-time inventory tracking, AI-powered recipe suggestions, and dietary information for food items.",
      github: "https://github.com/kusum-bhattarai/BobcatBounty",
      live: "https://bobcat-bounty-app-1-tarive22.replit.app/",
      image: "/media/bobcat_bounty.png",
      video: "/media/bobcat_bounty1.mp4",
      date: "Completed November 2024",
      tags: ["React", "Postgres Neon", "Figma", "Replit", "AI"],
      tweetId: "1858297886196535730",
      imageAspectRatio: "16/9",
      videoAspectRatio: "6/6",
    },
    {
      title: "TXST AI Academic Advisor",
      subtitle: "AI-powered academic advisor",
      description:
        "This AI application serves as an academic advisor for Texas State University students, allowing them to ask questions about McCoy College's undergraduate programs, course details, and receive recommendations tailored to their interests or needs.",
      github: "https://github.com/Tar-ive/txst-ai",
      live: "https://txst-ai.vercel.app/",
      image: "/media/ai-advisor.png",
      date: "Since September 2024",
      tags: ["AI", "Education", "Next.js"],
      aspectRatio: "9/9",
      imageAspectRatio: "1/1",
      videoAspectRatio: "9/16",
    },
    {
      title: "Where Do I Park?",
      subtitle: "Real-time parking availability app",
      description: "Real-time parking availability app using geocoded coordinates and a public ledger system",
      github: "https://github.com/Tar-ive/WhereDoIPark",
      live: "https://where-do-i-park-tarive22.replit.app/",
      image: "/media/where_do_i_park.png",
      date: "Completed August 2024",
      tags: ["Geolocation", "Real-time", "Public Ledger"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Echoz",
      subtitle: "Digital time capsule app backend",
      description: "Digital time capsule app backend using Flask, PostgreSQL, AWS S3, and Lambda functions",
      github: "https://github.com/mjm517/Echoz",
      devpost: "https://devpost.com/software/echoz-b5ck82",
      image: "/media/echoz.jpeg",
      date: "Completed May 2024",
      tags: ["Flask", "AWS", "PostgreSQL", "Lambda"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Business Ecosystem Simulator",
      subtitle: "Business ecosystem simulator",
      description: "Business ecosystem simulator using Node.js, React, and HTML",
      github: "https://github.com/Tar-ive/all-the-life-simulation",
      live: "https://all-the-life-simulation.vercel.app/",
      image: "/media/business-simulator.png",
      date: "Completed April 2024",
      tags: ["Node.js", "React", "Simulation"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Blackjack Q-Learning App",
      subtitle: "AI Blackjack strategy app",
      description: "AI app decoding blackjack strategies through Q-Learning algorithms",
      github: "https://github.com/Tar-ive/blackjack-AI",
      live: "https://blackjack-ai.streamlit.app/",
      image: "/media/blackjack.png",
      date: "Completed March 2024",
      tags: ["AI", "Q-Learning", "Streamlit"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "President's Economic Impact",
      subtitle: "Interactive economic impact visualization",
      description: "Interactive web app visualizing economic impact of US Presidents from 1921 to 2024",
      github: "https://github.com/Tar-ive/us-presidents-economic-impact",
      live: "https://tar-ive.github.io/us-presidents-economic-impact/",
      image: "/media/president.png",
      date: "Completed February 2024",
      tags: ["Data Visualization", "Economics", "Interactive"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Credit Risk Prediction System",
      subtitle: "ML-based credit risk prediction",
      description: "ML-based credit risk prediction system to evaluate lending risks",
      github: "https://github.com/Tar-ive/credit-risk-prediction-system",
      live: "https://credit-risk.netlify.app/",
      image: "/media/credit_default.png",
      date: "Completed January 2024",
      tags: ["Machine Learning", "Finance", "Risk Assessment"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
    {
      title: "Interactive SQL Query Application",
      subtitle: "User-friendly SQL query app",
      description: "Streamlit app for interacting with SQL databases via a user-friendly interface",
      github: "https://github.com/Tar-ive/sql_query_app",
      live: "https://sql-db.streamlit.app/",
      image: "/media/sql-query1.webp",
      date: "Completed December 2023",
      tags: ["SQL", "Streamlit", "Database"],
      aspectRatio: "16/9",
      imageAspectRatio: "16/9",
      videoAspectRatio: "9/16",
    },
  ]

  const sortedProjects = projects.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container px-4 py-12 mx-auto">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-8">
          <div className="space-y-6 flex-1">
            <h1 className="text-3xl font-bold">Saksham Adhikari</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>Austin, TX</span>
            </div>
            <div className="flex gap-2">
              <Link href="https://x.com/saksham_adh" target="_blank" className="rounded-md p-2 hover:bg-gray-100">
                <XLogo className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/saksham-adhikari-4727571b5/"
                target="_blank"
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
              </Link>
              <Link href="https://github.com/Tar-ive" target="_blank" className="rounded-md p-2 hover:bg-gray-100">
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://drive.google.com/file/d/1Fg7YZk_gBxakPRlKMskjW-Dv9c5S4ILg/view?usp=sharing"
                target="_blank"
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <Globe className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-base leading-relaxed">
              Nepal-born, Texas-based, eternally curious. I'm Saksham, 20, and I spend my days tinkering with AI, making
              data tell stories, and building whatever sounds fun. Usually found building AI and ML apps, meditating,
              reading books and hanging out with my{" "}
              <a href="https://quamos.dev/" className="text-pink-600 hover:underline">
                girlfriend❤️{" "}
              </a>{" "}
              and friends.
            </p>
            <ul className="space-y-2">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span dangerouslySetInnerHTML={{ __html: achievement }} />
                </li>
              ))}
            </ul>
          </div>
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-200">
            <Image src="media/profile_p.jpeg" alt="Profile" fill className="object-cover" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Projects Section */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="text-xl font-bold mb-8">Currently Building</h2>
        <div className="space-y-8">
          {sortedProjects.map((project, index) => (
            <Card key={index} className={`overflow-hidden ${project.pinned ? "border-2 border-blue-500" : ""}`}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                </div>
                <Badge variant="secondary" className="self-start sm:self-center">
                  {project.date}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                  {project.video ? (
                    <div
                      className="relative w-full rounded-lg overflow-hidden bg-black"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <VideoPreview src={project.video} poster={project.image} aspectRatio="16/9" />
                    </div>
                  ) : (
                    <div
                      className="relative w-full rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                      style={{ aspectRatio: "16/9" }}
                      onClick={() => setExpandedImage(project.image)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            fill
                            className="object-contain hover:scale-105 transition-transform"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground max-w-3xl mx-auto text-center">{project.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4 justify-center">
                  {project.github && (
                    <Link href={project.github} target="_blank">
                      <Button variant="outline" size="sm">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                  )}
                  {project.live && (
                    <Link href={project.live} target="_blank">
                      <Button variant="outline" size="sm">
                        <Globe className="mr-2 h-4 w-4" />
                        View Project
                      </Button>
                    </Link>
                  )}
                </div>
                {project.tweetId && (
                  <div className="mt-4 flex justify-center">
                    <TwitterTweetEmbed tweetId={project.tweetId} />
                  </div>
                )}
                {project.xHandle && (
                  <div className="mt-4 flex justify-center">
                    <Link href={`https://x.com/${project.xHandle}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <XLogo className="mr-2 h-4 w-4" />
                        Follow on X
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!expandedImage} onOpenChange={() => setExpandedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          {expandedImage && (
            <div className="relative w-full h-full" style={{ minHeight: "80vh" }}>
              <Image
                src={expandedImage || "/placeholder.svg"}
                alt="Expanded view"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Separator />

      {/* Experience Section */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="text-xl font-bold mb-8">Work Experience</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resident Assistant</CardTitle>
                <Badge>August 2024 - Present</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Housing and Residential Life, Texas State University</p>
              <ul className="mt-2 space-y-2">
                <li>• Creating a safe and supportive environment for new students</li>
                <li>• Trained in trauma detection, basic CPR, and emergency procedures</li>
                <li>• Successfully managing and supporting 25 residents</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conference Assistant</CardTitle>
                <Badge>Summer 2024</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Housing and Residential Life, Texas State University</p>
              <ul className="mt-2 space-y-2">
                <li>• Managed flow of over 6000 students during summer conference activities</li>
                <li>• Part of the NSO core team for program planning and operations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Data Science Intern</CardTitle>
                <Badge>March 2023 - June 2023</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Dursikshya Education Network Pvt Ltd, Lalitpur District, Nepal</p>
              <ul className="mt-2 space-y-2">
                <li>
                  • Analyzed predictive rates of industry demand for college graduates, identifying sectors and
                  companies with the highest need for new hires
                </li>
                <li>
                  • Developed Regression models to forecast employment trends and opportunities in various industries
                </li>
                <li>
                  • Collaborated with the team to create targeted marketing campaigns based on insights to create
                  targeted training programs for conversion
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Education Section */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="text-xl font-bold mb-8">Education</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Texas State University • McCoy College of Business</CardTitle>
              <Badge>2023-2027</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Bachelor of Business Administration</p>
              <p className="text-muted-foreground">Computer Information Systems with a minor in Data Science</p>
            </div>
            <div>
              <p className="font-medium">GPA: 4.0</p>
            </div>
            <div>
              <p className="font-medium">Scholarships & Awards</p>
              <ul className="mt-2 space-y-1">
                <li>• Undergraduate Launch Scholarship (AKAEAF)</li>
                <li>• Texas State Merit Scholarship</li>
                <li>• Merry Kone Fitzpatrick Endowed Scholarship</li>
                <li>• Web Service Company/Montgomery Endowed Scholarship</li>
                <li>• Dean's List 2023-2024</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Skills Section */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="text-xl font-bold mb-8">Skills & Interests</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Python", "R", "MySQL", "HTML", "CSS", "JavaScript", "Docker", "Pine script", "MATLAB"].map(
                  (skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Vipassana", "Investing", "Books", "Distant Running", "Sanskrit Scriptures"].map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

