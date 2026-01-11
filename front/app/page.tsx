import { FileUploadSection } from "@/components/file-upload-section"
import { PrintConfigSection } from "@/components/print-config-section"
import { ShopSelectionSection } from "@/components/shop-selection-section"
import { Header } from "@/components/header"
import { PrintProvider } from "@/context/PrintContext"


export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Štampanje bez čekanja u redu</h1>
            <p className="text-muted-foreground">Otpremite fajlove, platite online i pokupite gotove kopije</p>
          </div>
          <PrintProvider>
            <FileUploadSection />
            {/* <PrintTypeSelector /> */}
            <PrintConfigSection />
            <ShopSelectionSection />
          </PrintProvider>
        </div>
      </main>
    </div>
  )
}
