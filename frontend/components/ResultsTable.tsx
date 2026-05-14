"use client"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "./ui/button"
import { ExternalLink } from "lucide-react"
import { Clip } from "@/types"

interface ResultsTableProps {
  clips: Clip[]
}

export const ResultsTable = ({ clips }: ResultsTableProps) => {
  const { isRtl } = useTranslation()

  return (
    <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden mt-10">
      <table className="w-full text-left">
        <thead className="bg-[#12121a] text-gray-400 text-sm">
          <tr>
            <th className="p-4">#</th>
            <th className="p-4">{isRtl ? "العنوان" : "Title"}</th>
            <th className="p-4">{isRtl ? "درجة الانتشار" : "Viral Score"}</th>
            <th className="p-4">{isRtl ? "النوع" : "Type"}</th>
            <th className="p-4">{isRtl ? "المدة" : "Duration"}</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {clips.map((clip, i) => (
            <tr key={clip.id} className="border-b border-gray-800 hover:bg-[#12121a]/50 transition-colors">
              <td className="p-4 text-gray-400">{i + 1}</td>
              <td className="p-4 font-medium">{isRtl ? clip.suggested_title_ar : clip.suggested_title}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${clip.viral_score >= 85 ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'}`}>
                  {clip.viral_score}
                </span>
              </td>
              <td className="p-4 text-sm">{clip.clip_type}</td>
              <td className="p-4 text-sm text-gray-400">{clip.duration_seconds.toFixed(1)}s</td>
              <td className="p-4 text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.open(clip.clip_url)}
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
