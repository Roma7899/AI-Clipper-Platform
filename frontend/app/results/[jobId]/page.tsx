"use client"
import { useEffect, useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { getJobResults } from "@/lib/api"
import { LanguageToggle } from "@/components/LanguageToggle"
import { ClipCard } from "@/components/ClipCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Download, ArrowLeft, Loader2 } from "lucide-react"

import { Clip, VideoInfo } from "@/types"

interface ResultData {
  video_info: VideoInfo
  clips: Clip[]
  excel_url?: string
}

export default function ResultsPage({ params }: { params: { jobId: string } }) {
  const { t, isRtl } = useTranslation()
  const [data, setData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getJobResults(params.jobId)
        setData(res)
      } catch (error) {
        console.error("Results error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [params.jobId])

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-accent mb-4" size={48} />
      <p className="text-gray-400">Loading your viral clips...</p>
    </div>
  )

  if (!data || !data.video_info) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-red-500">Error loading results</h1>
      <Link href="/dashboard">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  )

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'font-arabic' : 'font-english'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-card rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-xl font-bold text-accent">AI Clipper</span>
        </div>
        <div className="flex items-center gap-6">
          <LanguageToggle />
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t.results.title}</h1>
            <p className="text-gray-400">{data.video_info.title}</p>
          </div>
          <div className="flex gap-4">
            {data.excel_url && (
              <Button 
                variant="success" 
                className="flex items-center gap-2"
                onClick={() => window.open(data.excel_url)}
              >
                <FileText size={20} />
                {t.results.download_excel}
              </Button>
            )}
            <Button className="flex items-center gap-2">
              <Download size={20} />
              {t.results.download_all}
            </Button>
          </div>
        </div>

        {/* Clips Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.clips.map((clip: Clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>

        {data.clips.length === 0 && (
          <div className="text-center py-20 bg-card border border-gray-800 rounded-3xl">
            <p className="text-gray-400">No clips found for this video. Try a different video.</p>
          </div>
        )}
      </main>
    </div>
  )
}
