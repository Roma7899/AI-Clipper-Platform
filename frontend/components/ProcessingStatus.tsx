"use client"
import { useEffect, useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { getJobStatus } from "@/lib/api"
import { useRouter } from "next/navigation"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { JobStatus } from "@/types"

interface ProcessingStatusProps {
  jobId: string
}

export const ProcessingStatus = ({ jobId }: ProcessingStatusProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [status, setStatus] = useState<JobStatus | null>(null)

  useEffect(() => {
    const poll = async () => {
      try {
        const data = await getJobStatus(jobId)
        setStatus(data)
        if (data.status === 'completed') {
          router.push(`/results/${jobId}`)
        }
      } catch (error) {
        console.error("Polling error:", error)
      }
    }

    const interval = setInterval(poll, 3000)
    poll()

    return () => clearInterval(interval)
  }, [jobId, router])

  if (!status) return <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-accent" size={40} /></div>

  const steps = [
    { key: 'downloading', label: t.process.steps.downloading },
    { key: 'extracting_audio', label: t.process.steps.extracting },
    { key: 'transcribing', label: t.process.steps.transcribing },
    { key: 'analyzing', label: t.process.steps.analyzing },
    { key: 'processing_clips', label: t.process.steps.processing },
    { key: 'generating_excel', label: t.process.steps.excel },
    { key: 'uploading', label: t.process.steps.uploading },
  ]

  return (
    <div className="max-w-2xl mx-auto bg-card border border-gray-800 rounded-3xl p-10">
      <div className="text-center mb-10">
        <div className="text-5xl font-bold text-accent mb-4">{status.progress}%</div>
        <div className="w-full bg-[#0a0a0f] h-3 rounded-full overflow-hidden">
          <div 
            className="bg-accent h-full transition-all duration-500" 
            style={{ width: `${status.progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step) => {
          const isCompleted = status.steps_completed?.includes(step.key) || status.status === 'completed'
          const isCurrent = status.current_step?.includes(step.key)

          return (
            <div key={step.key} className={`flex items-center gap-4 ${isCompleted ? 'text-success' : isCurrent ? 'text-accent' : 'text-gray-600'}`}>
              {isCompleted ? <CheckCircle2 size={24} /> : isCurrent ? <Loader2 className="animate-spin" size={24} /> : <Circle size={24} />}
              <span className="text-lg font-medium">{step.label}</span>
            </div>
          )
        })}
      </div>

      {status.status === 'failed' && (
        <div className="mt-10 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center">
          {status.error_message || "Something went wrong. Please try again."}
        </div>
      )}
    </div>
  )
}
