import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live"
import * as Icons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const scope = {
  ...Icons,
  Button,
  Card,
  Input,
}

interface CodeSandboxProps {
  code: string
}

export default function CodeSandbox({ code }: CodeSandboxProps) {
  return (
    <LiveProvider code={code} scope={scope} noInline={false}>
      <div className="not-prose grid gap-4 my-4">
        <div className="rounded-lg border bg-white p-4">
          <LivePreview />
        </div>

        <LiveError className="text-sm text-red-500 p-2 bg-red-50 rounded" />

        <div className="relative">
          <LiveEditor
            className="rounded-lg !font-mono !text-sm"
            style={{
              background: "#1e2937", // Navy blue background
              padding: "1rem",
              color: "#e5e7eb",
            }}
          />
          <div className="absolute top-2 right-2 text-xs text-gray-400">Live Editor</div>
        </div>
      </div>
    </LiveProvider>
  )
}

