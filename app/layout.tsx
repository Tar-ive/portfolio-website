import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Nav } from "@/components/nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Saksham Adhikari - Portfolio & Blog",
  description: "Nepal-born, Texas-based, eternally curious developer tinkering with AI and full-stack projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}

