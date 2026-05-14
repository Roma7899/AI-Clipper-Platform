"use client"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/LanguageToggle"
import Link from "next/link"
import { Plus, Video, Zap, BarChart2 } from "lucide-react"

export default function Dashboard() {
  const { t, isRtl } = useTranslation()

  // Mock data for recent videos
  const recentVideos = [
    { id: "1", title: "My Podcast Episode 1", status: "completed", date: "2026-05-10", clips: 5 },
    { id: "2", title: "Gaming Stream Highlight", status: "processing", date: "2026-05-14", clips: 0 },
    { id: "3", title: "Tutorial on AI", status: "failed", date: "2026-05-12", clips: 0 },
  ]

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'font-arabic' : 'font-english'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-800">
        <Link href="/" className="text-xl font-bold text-accent">AI Clipper</Link>
        <div className="flex items-center gap-6">
          <LanguageToggle />
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold">U</div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">{t.nav.dashboard}</h1>
          <Link href="/process">
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              {isRtl ? "فيديو جديد" : "New Video"}
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Video className="text-accent" />} label="Total Videos" value="12" />
          <StatCard icon={<Zap className="text-success" />} label="Total Clips" value="48" />
          <StatCard icon={<BarChart2 className="text-purple-400" />} label="Avg. Viral Score" value="82%" />
        </div>

        {/* Recent Videos Table */}
        <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 font-bold">
            {isRtl ? "آخر الفيديوهات" : "Recent Videos"}
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#12121a] text-gray-400 text-sm">
              <tr>
                <th className="p-4">{isRtl ? "الفيديو" : "Video"}</th>
                <th className="p-4">{isRtl ? "الحالة" : "Status"}</th>
                <th className="p-4">{isRtl ? "التاريخ" : "Date"}</th>
                <th className="p-4">{isRtl ? "الكليبات" : "Clips"}</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {recentVideos.map((video) => (
                <tr key={video.id} className="border-b border-gray-800 hover:bg-[#12121a]/50 transition-colors">
                  <td className="p-4 font-medium">{video.title}</td>
                  <td className="p-4">
                    <StatusBadge status={video.status} />
                  </td>
                  <td className="p-4 text-gray-400">{video.date}</td>
                  <td className="p-4">{video.clips}</td>
                  <td className="p-4 text-right">
                    <Link href={`/results/${video.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-gray-800">
      <div className="flex items-center gap-4 mb-2">
        {icon}
        <span className="text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: "bg-success/10 text-success border-success/20",
    processing: "bg-accent/10 text-accent border-accent/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
    pending: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  )
}
