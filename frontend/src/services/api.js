import { supabase } from './supabaseClient'
const API_URL = import.meta.env.VITE_API_URL

export async function checkWatering(data, plantId) {
  const { data: { session } } = await supabase.auth.getSession()

  const url = plantId
    ? `${API_URL}/watering/check?plant_id=${plantId}`
    : `${API_URL}/watering/check`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

export async function uploadPlantImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/plants/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || `Request failed: ${response.status}`)
  }

  return response.json()
}

export async function identifyPlant(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/plants/identify`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || `Request failed: ${response.status}`)
  }

  return response.json()
}

export async function checkDisease(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/plants/disease-check`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || `Request failed: ${response.status}`)
  }

  return response.json()
}

export async function getPlantDoctorExplanation(data) {
  const response = await fetch(`${API_URL}/plants/doctor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || `Request failed: ${response.status}`)
  }
  return response.json()
}

export async function askPlantQuestion(data) {
  const response = await fetch(`${API_URL}/plants/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || `Request failed: ${response.status}`)
  }
  return response.json()
}

export async function getWeather(lat, lon) {
  const response = await fetch(`${API_URL}/plants/weather?lat=${lat}&lon=${lon}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || `Request failed: ${response.status}`)
  }
  return response.json()
}

export async function getSustainability() {
  const { data: { session } } = await supabase.auth.getSession()

  const response = await fetch(`${API_URL}/plants/sustainability`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  })
  if (!response.ok) throw new Error('Could not load sustainability data')
  return response.json()
}

async function authGet(path) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    await supabase.auth.signOut()
    throw new Error('Session expired — please log in again')
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (response.status === 401) {
    await supabase.auth.signOut()
    throw new Error('Session expired — please log in again')
  }
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

export async function saveDiagnosis(payload) {
  const { data: { session } } = await supabase.auth.getSession()

  const response = await fetch(
    `${API_URL}/plants/save-diagnosis?` + new URLSearchParams(payload),
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    }
  )
  if (!response.ok) throw new Error('Could not save diagnosis')
  return response.json()
}

export const getPlantHistory = () => authGet('/dashboard/plants')
export const getDiagnosisHistory = () => authGet('/dashboard/diagnoses')
export const getWateringHistory = () => authGet('/dashboard/watering')