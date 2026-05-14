"use client"
import { useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { VideoUploader } from "@/components/VideoUploader"
import { ProcessingStatus } from "@/components/ProcessingStatus"
import { LanguageToggle } from "@/components/LanguageToggle"
import Link from "next/link"
import { submitVideo } from "@/lib/api"

interface UploadData {
  url?: string
  file?: File
  platform: string
  subtitle_language: string
}

export default function ProcessPage() {
  const { t, isRtl } = useTranslation()
  const [jobId, setJobId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (data: UploadData) => {
    setIsUploading(true)
    try {
      // For demo purposes, we'll use a hardcoded user_id
      const res = await submitVideo({ ...data, user_id: "00000000-0000-0000-0000-000000000000" })
      setJobId(res.job_id)
    } catch (error: any) {
      console.error("Upload error:", error)
      alert("Error: " + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'font-arabic' : 'font-english'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-800">
        <Link href="/dashboard" className="text-xl font-bold text-accent">AI Clipper</Link>
        <div className="flex items-center gap-6">
          <LanguageToggle />
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">{jobId ? t.process.processing : t.nav.process}</h1>
          <p className="text-gray-400">
            {jobId ? "We're working on your video. This may take a few minutes." : "Choose how you want to provide your video"}
          </p>
        </div>

        {jobId ? (
          <ProcessingStatus jobId={jobId} />
        ) : (
          <VideoUploader onUpload={handleUpload} isUploading={isUploading} />
        )}
      </main>
    </div>
  )
}
