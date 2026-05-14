import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
})

export const submitVideo = async (data: { url?: string; file?: File; platform: string; subtitle_language: string; user_id: string }) => {
  const formData = new FormData()
  if (data.url) formData.append('url', data.url)
  if (data.file) formData.append('file', data.file)
  formData.append('platform', data.platform)
  formData.append('subtitle_language', data.subtitle_language)
  formData.append('user_id', data.user_id)

  const response = await api.post('/api/videos/submit', formData)
  return response.data
}

export const getJobStatus = async (jobId: string) => {
  const response = await api.get(`/api/videos/status/${jobId}`)
  return response.data
}

export const getJobResults = async (jobId: string) => {
  const response = await api.get(`/api/videos/results/${jobId}`)
  return response.data
}

export const getResults = async (id: string) => {
  return getJobResults(id)
}

export default api
