import os
import json
import google.generativeai as genai
from typing import Dict, Any

class VideoAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash') # Using 1.5-flash as 2.5-flash might not be out/stable yet in SDK

    def analyze_transcript(self, transcript_data: Dict[str, Any], total_duration: int, platform: str, subtitle_language: str) -> Dict[str, Any]:
        """Analyzes the transcript using Gemini to find viral clips."""
        
        transcript_with_timestamps = ""
        for seg in transcript_data["segments"]:
            transcript_with_timestamps += f"[{seg['start']:.2f} - {seg['end']:.2f}] {seg['text']}\n"

        prompt = f"""
أنت خبير في تحليل المحتوى الرقمي وصناعة الـ Viral Short-Form Videos.

لديك الـ transcript التالي لفيديو مع timestamps دقيقة:
{transcript_with_timestamps}

مدة الفيديو الكاملة: {total_duration} ثانية
المنصة المستهدفة: {platform}
لغة الـ Subtitles المطلوبة: {subtitle_language}

مهمتك:
1. حلل الـ transcript بعمق
2. حدد كل المقاطع التي يمكن أن تصبح Viral Shorts
3. مش محدود بعدد — استخرج كل مقطع يستحق (ممكن 3 أو 15)
4. كل مقطع لازم يكون بين 15 و 90 ثانية
5. المقاطع ممكن تتداخل أو تكون من أجزاء مختلفة

لكل مقطع قدم:
- start_time: بالثواني (float)
- end_time: بالثواني (float)  
- viral_score: من 1 إلى 100
- viral_reason: سبب الـ viral score (جملة واحدة)
- clip_type: (funny|emotional|shocking|informative|motivational|controversial)
- hook_line: أقوى جملة في المقطع تكون في الأول
- suggested_title: عنوان SEO بالإنجليزي (مش أكتر من 60 حرف)
- suggested_title_ar: عنوان SEO بالعربي
- keywords: قائمة من 10 keywords للـ SEO (بالإنجليزي)
- description: وصف كامل للـ post (بالإنجليزي، 150-300 كلمة، مع hashtags)
- description_ar: وصف كامل للـ post (بالعربي، مع hashtags عربية)
- emojis: 3-5 إيموجيز مناسبة للمقطع
- platform_recommendation: (TikTok|Reels|Shorts|All)

رتب المقاطع من الأعلى Viral Score للأقل.

رد بـ JSON فقط بدون أي نص إضافي:
{{
  "clips": [
    {{
      "start_time": 0.0,
      "end_time": 45.0,
      "viral_score": 94,
      "viral_reason": "...",
      "clip_type": "informative",
      "hook_line": "...",
      "suggested_title": "...",
      "suggested_title_ar": "...",
      "keywords": ["kw1", "kw2", ...],
      "description": "...",
      "description_ar": "...",
      "emojis": "🔥💡😱",
      "platform_recommendation": "TikTok"
    }}
  ],
  "total_clips_found": 7,
  "video_summary": "ملخص الفيديو في جملتين",
  "video_summary_ar": "ملخص الفيديو بالعربي"
}}
"""
        response = self.model.generate_content(prompt)
        
        # Extract JSON from response text
        try:
            content = response.text
            # Remove markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            return json.loads(content)
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            return {"clips": [], "total_clips_found": 0}
