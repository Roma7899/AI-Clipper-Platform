"use client"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/LanguageToggle"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LandingPage() {
  const { t, isRtl } = useTranslation()

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRtl ? 'font-arabic' : 'font-english'}`}>
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-accent">AI Clipper</div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-accent transition-colors">{t.nav.dashboard}</Link>
          <LanguageToggle />
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-10 py-6 rounded-full">
                {t.hero.cta}
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20 bg-[#12121a]/50 rounded-3xl">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon="🤖" 
              title={isRtl ? "تحليل ذكي" : "Smart Analysis"} 
              desc={isRtl ? "نستخدم Gemini AI لاختيار أفضل اللحظات" : "We use Gemini AI to pick the best moments"} 
            />
            <FeatureCard 
              icon="🎬" 
              title={isRtl ? "مونتاج تلقائي" : "Auto Editing"} 
              desc={isRtl ? "قص، كرب، وترجمة بلمسة واحدة" : "Cut, crop, and subtitle with one touch"} 
            />
            <FeatureCard 
              icon="📈" 
              title={isRtl ? "جاهز للانتشار" : "Viral Ready"} 
              desc={isRtl ? "مقاطع محسنة لـ TikTok و Reels" : "Optimized clips for TikTok and Reels"} 
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-success mb-2">10K+</div>
              <div className="text-gray-400">Videos Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50K+</div>
              <div className="text-gray-400">Viral Clips Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">99%</div>
              <div className="text-gray-400">Happy Users</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-10 border-t border-gray-800 text-center text-gray-500">
        © 2026 AI Clipper. All rights reserved.
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card border border-gray-800 hover:border-accent transition-all group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  )
}
