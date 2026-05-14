const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const submitVideo = async (data: { url?: string; file?: File; platform: string; subtitle_language: string; user_id: string }) => {
  const formData = new FormData()
  if (data.url) formData.append('url', data.url)
  if (data.file) formData.append('file', data.file)
  formData.append('platform', data.platform)
  formData.append('subtitle_language', data.subtitle_language)
  formData.append('user_id', data.user_id)

  const response = await fetch(`${API_URL}/api/videos/submit`, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error(await response.text())
  }
  return await response.json()
}

export const getJobStatus = async (jobId: string) => {
  const response = await fetch(`${API_URL}/api/videos/status/${jobId}`)
  if (!response.ok) {
    throw new Error(await response.text())
  }
  return await response.json()
}

export const getJobResults = async (jobId: string) => {
  const response = await fetch(`${API_URL}/api/videos/results/${jobId}`)
  if (!response.ok) {
    throw new Error(await response.text())
  }
  return await response.json()
}

export const getResults = async (id: string) => {
  return getJobResults(id)
}
