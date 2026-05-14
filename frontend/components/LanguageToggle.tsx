"use client"
import { useTranslation } from "@/hooks/useTranslation"

export const LanguageToggle = () => {
  const { lang, toggleLanguage } = useTranslation()

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md border border-accent hover:bg-accent transition-colors"
    >
      {lang === 'ar' ? 'English' : 'العربية'}
    </button>
  )
}
