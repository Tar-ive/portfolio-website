import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/mdx/pdf-viewer'), {
    ssr: false,
    loading: () => (
        <div className="my-6 p-8 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading PDF viewer...</span>
            </div>
        </div>
    ),
});

export default function PDFTestPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">PDF Viewer Test</h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Inline PDF Viewer</h2>
                        <PDFViewer
                            src="/SWE_python.pdf"
                            title="Software Engineering Python Document"
                            embedded={true}
                            downloadable={true}
                            showToolbar={true}
                            viewMode="inline"
                            height={600}
                        />
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Compact PDF Viewer</h2>
                        <PDFViewer
                            src="/SWE_python.pdf"
                            title="Compact View"
                            embedded={true}
                            downloadable={true}
                            showToolbar={true}
                            viewMode="inline"
                            height={400}
                        />
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">External View Mode (Fallback)</h2>
                        <PDFViewer
                            src="/SWE_python.pdf"
                            title="External View"
                            viewMode="external"
                            fallbackText="This PDF requires external viewing. Click to download."
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}