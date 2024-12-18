import "@/styles/globals.css"
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Saksham Adhikari - Portfolio",
  description: "Nepal-born, Texas-based, eternally curious developer tinkering with AI and full-stack projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'