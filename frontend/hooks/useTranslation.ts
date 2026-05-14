"use client"
import { useState, useEffect } from 'react'
import { ar, en } from '../lib/translations'

export type Language = 'ar' | 'en'

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>('ar')

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language
    if (savedLang) setLang(savedLang)
  }, [])

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
  }

  const t = lang === 'ar' ? ar : en
  const isRtl = lang === 'ar'

  return { t, lang, toggleLanguage, isRtl }
}
