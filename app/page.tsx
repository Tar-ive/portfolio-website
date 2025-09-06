"use client";

import { Github, Globe, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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

  // Projects have been migrated to the /projects section

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
                href="/media/saksham_resume_2025.pdf"
                target="_blank"
                className="rounded-md p-2 hover:bg-gray-100"
                title="Download Resume"
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
            <Image src="/media/profile_p.jpeg" alt="Profile" fill className="object-cover" />
          </div>
        </div>
      </div>

      <Separator />


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

