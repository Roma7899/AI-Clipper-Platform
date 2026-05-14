-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- profiles table for extra user data
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table (الفيديوهات الأصلية)
CREATE TABLE videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url TEXT,                    -- YouTube link لو في
  original_filename TEXT,               -- اسم الملف لو رفع
  title TEXT,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'pending',        -- pending | downloading | transcribing | analyzing | processing | completed | failed
  error_message TEXT,
  r2_key TEXT,                          -- مسار الفيديو الأصلي في R2
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clips table (الكليبات الناتجة)
CREATE TABLE clips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clip_number INTEGER,                  -- ترتيب الكليب
  clip_url TEXT,                        -- رابط الكليب في R2
  excel_url TEXT,                       -- رابط ملف Excel
  start_time_seconds FLOAT,
  end_time_seconds FLOAT,
  duration_seconds FLOAT,
  viral_score INTEGER,                  -- 1-100
  suggested_title TEXT,                 -- عنوان SEO
  suggested_title_ar TEXT,              -- عنوان عربي
  keywords TEXT[],                      -- array of keywords
  description TEXT,                     -- وصف كامل
  description_ar TEXT,                  -- وصف عربي
  hook_line TEXT,
  clip_type TEXT,                       -- funny|emotional|shocking|informative|motivational|controversial
  emojis TEXT,
  platform TEXT DEFAULT 'TikTok',       -- TikTok|Reels|Shorts
  subtitles_language TEXT DEFAULT 'ar', -- لغة الـ subtitles
  r2_key TEXT,                          -- مسار الكليب في R2
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table (تتبع حالة المعالجة)
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  current_step TEXT,                    -- الخطوة الحالية
  progress INTEGER DEFAULT 0,           -- 0-100
  steps_completed TEXT[] DEFAULT '{}',
  excel_url TEXT,                       -- رابط الـ Excel النهائي
  total_clips INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profiles" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users see own videos" ON videos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own clips" ON clips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
