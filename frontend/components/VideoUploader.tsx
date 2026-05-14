"use client"
import { useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "./ui/button"
import { Youtube, Upload, Link as LinkIcon } from "lucide-react"

interface VideoUploaderProps {
  onUpload: (data: { url?: string; file?: File; platform: string; subtitle_language: string }) => void
  isUploading: boolean
}

export const VideoUploader = ({ onUpload, isUploading }: VideoUploaderProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url')
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [language, setLanguage] = useState('ar')

  const handleSubmit = () => {
    onUpload({ url, platform, subtitle_language: language })
  }

  return (
    <div className="max-w-3xl mx-auto bg-card border border-gray-800 rounded-3xl p-8">
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 border transition-all ${activeTab === 'url' ? 'bg-accent border-accent' : 'bg-[#12121a] border-gray-800'}`}
        >
          <Youtube size={20} />
          {t.process.url_tab}
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 border transition-all ${activeTab === 'file' ? 'bg-accent border-accent' : 'bg-[#12121a] border-gray-800'}`}
        >
          <Upload size={20} />
          {t.process.upload_tab}
        </button>
      </div>

      {activeTab === 'url' ? (
        <div className="mb-8">
          <label className="block text-sm text-gray-400 mb-2">{t.process.url_tab}</label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder={t.process.url_placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl py-4 pl-12 pr-4 focus:border-accent outline-none transition-colors"
            />
          </div>
        </div>
      ) : (
        <div className="mb-8 border-2 border-dashed border-gray-800 rounded-2xl p-12 text-center hover:border-accent transition-colors cursor-pointer">
          <Upload className="mx-auto mb-4 text-gray-500" size={40} />
          <p className="text-gray-400">Drag & Drop video file here or click to browse</p>
          <p className="text-xs text-gray-600 mt-2">MP4, MOV, AVI up to 500MB</p>
        </div>
      )}

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t.process.platform_label}</label>
          <select 
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-[#12121a] border border-gray-800 rounded-xl py-3 px-4 outline-none focus:border-accent"
          >
            <option value="TikTok">TikTok</option>
            <option value="Reels">Instagram Reels</option>
            <option value="Shorts">YouTube Shorts</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t.process.language_label}</label>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-[#12121a] border border-gray-800 rounded-xl py-3 px-4 outline-none focus:border-accent"
          >
            <option value="ar">العربية (Arabic)</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={isUploading || (activeTab === 'url' && !url)}
        className="w-full py-6 rounded-xl text-lg font-bold"
      >
        {isUploading ? t.process.processing : t.process.start_btn}
      </Button>
    </div>
  )
}
