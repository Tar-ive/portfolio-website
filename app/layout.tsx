import "@/styles/globals.css"
import { Nav } from "@/components/nav"

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
      <body className="min-h-screen bg-white font-sans">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}

