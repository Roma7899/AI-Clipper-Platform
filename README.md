# 🎬 AI Clipping Platform

AI Clipping Platform هو نظام متكامل لتحويل الفيديوهات الطويلة إلى مقاطع قصيرة (Shorts/Reels/TikTok) تلقائياً باستخدام الذكاء الاصطناعي.

## 🚀 التقنيات المستخدمة (Tech Stack)

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui.
- **Backend:** FastAPI (Python).
- **AI:** Google Gemini 2.5 Flash (Analysis), Groq Whisper Large v3 (Transcription).
- **Processing:** FFmpeg (Video Editing), yt-dlp (YouTube Downloader).
- **Database:** Supabase (PostgreSQL).
- **Storage:** Cloudflare R2 (S3-compatible).

---

## 🛠️ التشغيل محلياً (Local Development)

### 1. المتطلبات (Prerequisites)
- Python 3.10+
- Node.js 18+
- FFmpeg مثبت على جهازك.

### 2. إعداد الـ Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# قم بتعبئة البيانات في ملف .env
uvicorn main:app --reload --port 8000
```

### 3. إعداد الـ Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local # قم بإنشاء الملف وتعبئة البيانات
npm run dev
```

---

## 🗄️ إعداد قاعدة البيانات (Supabase)

1. أنشئ مشروعاً جديداً على [Supabase](https://supabase.com).
2. اذهب إلى **SQL Editor**.
3. قم بتشغيل الكود الموجود في `supabase/migrations/001_initial_schema.sql`.
4. انسخ الـ `API URL` والـ `Service Role Key` وضعهم في ملف `.env` الخاص بالـ backend.

---

## ☁️ إعداد التخزين (Cloudflare R2)

1. أنشئ Bucket جديد في Cloudflare R2.
2. قم بتفعيل **Public Access** للـ Bucket.
3. استخرج الـ `Access Key ID` والـ `Secret Access Key`.
4. ضع البيانات في ملف `.env` الخاص بالـ backend.

---

## 🚀 النشر (Deployment)

### Backend (على Render.com)
1. New → Web Service.
2. اربط مستودع GitHub الخاص بك.
3. Build Command: `pip install -r requirements.txt`.
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. أضف جميع المتغيرات البيئية (Environment Variables).

### Frontend (على Vercel)
1. New Project → Import Repo.
2. اختر Next.js.
3. أضف المتغيرات البيئية (NEXT_PUBLIC_...).
4. Deploy!

---

## 🌍 Internationalization (i18n)
النظام يدعم اللغتين العربية والإنجليزية بالكامل مع دعم الـ RTL/LTR تلقائياً.

---

© 2026 AI Clipper. All rights reserved.
