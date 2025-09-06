import dynamic from 'next/dynamic';

// Create a client-only Mermaid component to avoid hydration issues
const MermaidComponent = dynamic(() => import('@/components/mermaid-client'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded">Loading diagram...</div>
});

export default function MermaidTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mermaid Test Page</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Simple Graph</h2>
            <MermaidComponent code={`
              graph TD
              A[Client] --> B[Load Balancer]
              B --> C[Server1]
              B --> D[Server2]
            `} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Flowchart with Decision</h2>
            <MermaidComponent code={`
              graph TB
              A[User Input] --> B[Validation]
              B --> C{Valid?}
              C -->|Yes| D[Process Data]
              C -->|No| E[Show Error]
              D --> F[Save to Database]
              F --> G[Return Success]
              E --> H[Return Error]
            `} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Sequence Diagram</h2>
            <MermaidComponent code={`
              sequenceDiagram
              participant A as Alice
              participant B as Bob
              A->>B: Hello Bob, how are you?
              B-->>A: Great!
            `} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Class Diagram</h2>
            <MermaidComponent code={`
              classDiagram
              class Animal {
                +String name
                +int age
                +makeSound()
              }
              class Dog {
                +String breed
                +bark()
              }
              Animal <|-- Dog
            `} />
          </div>
        </div>
      </div>
    </div>
  );
}