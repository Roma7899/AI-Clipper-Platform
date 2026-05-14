export interface Clip {
  id: string
  video_id: string
  user_id: string
  clip_number: number
  clip_url: string
  excel_url?: string
  start_time_seconds: number
  end_time_seconds: number
  duration_seconds: number
  viral_score: number
  suggested_title: string
  suggested_title_ar: string
  keywords: string[]
  description: string
  description_ar: string
  hook_line: string
  clip_type: string
  emojis: string
  platform: string
  subtitles_language: string
}

export interface VideoInfo {
  id: string
  user_id: string
  original_url?: string
  original_filename?: string
  title: string
  duration_seconds: number
  status: string
  error_message?: string
  r2_key?: string
}

export interface JobStatus {
  id: string
  video_id: string
  user_id: string
  status: string
  current_step: string
  progress: number
  steps_completed: string[]
  excel_url?: string
  total_clips: number
}
