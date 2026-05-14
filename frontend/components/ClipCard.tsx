"use client"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "./ui/button"
import { Download, Copy, Zap } from "lucide-react"
import { Clip } from "@/types"

interface ClipCardProps {
  clip: Clip
}

export const ClipCard = ({ clip }: ClipCardProps) => {
  const { t, isRtl } = useTranslation()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="bg-card border border-gray-800 rounded-3xl overflow-hidden hover:border-accent transition-all group">
      {/* Video Preview (Placeholder or actual video) */}
      <div className="aspect-[9/16] bg-black relative">
        <video 
          src={clip.clip_url} 
          controls 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
          <Zap size={14} fill="currentColor" />
          {clip.viral_score}
        </div>
        <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
          {clip.clip_type}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{isRtl ? clip.suggested_title_ar : clip.suggested_title}</h3>
        <p className="text-sm text-gray-500 mb-4 italic">&quot;{clip.hook_line}&quot;</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {clip.keywords?.slice(0, 3).map((kw: string) => (
            <span key={kw} className="px-2 py-1 bg-[#12121a] border border-gray-800 rounded-md text-xs text-gray-400">
              #{kw}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-xs"
            onClick={() => window.open(clip.clip_url)}
          >
            <Download size={14} />
            {t.results.download_clip}
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-xs"
            onClick={() => copyToClipboard(isRtl ? clip.description_ar : clip.description)}
          >
            <Copy size={14} />
            {t.results.copy_info}
          </Button>
        </div>
      </div>
    </div>
  )
}
