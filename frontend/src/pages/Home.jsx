import { useState, useEffect } from 'react'
import ImageUpload from '../components/ImageUpload'
import PlantDoctor from '../components/PlantDoctor'
import WateringCheck from '../components/WateringCheck'
import SustainabilityCard from '../components/SustainabilityCard'
import {
  identifyPlant,
  checkDisease,
  getWeather,
  saveDiagnosis,
} from '../services/api'
import { getUserLocation } from '../services/location'
import { supabase } from '../services/supabaseClient'

export default function Home({ onViewDashboard }) {
  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [plant, setPlant] = useState(null)
  const [disease, setDisease] = useState(null)
  const [error, setError] = useState(null)

  const [savedPlantId, setSavedPlantId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const weatherTheme = (() => {
    const condition = (weather?.condition || '').toLowerCase()

    if (condition.includes('rain') || condition.includes('storm')) {
      return {
        background: 'linear-gradient(135deg, rgba(191,219,254,0.9) 0%, rgba(224,242,254,0.95) 35%, rgba(186,230,253,0.9) 100%)',
        border: '#bfdbfe',
      }
    }

    if (condition.includes('cloud')) {
      return {
        background: 'linear-gradient(135deg, rgba(226,232,240,0.9) 0%, rgba(224,247,255,0.95) 45%, rgba(191,219,254,0.9) 100%)',
        border: '#cbd5e1',
      }
    }

    if (condition.includes('snow')) {
      return {
        background: 'linear-gradient(135deg, rgba(224,242,254,0.9) 0%, rgba(239,246,255,0.95) 45%, rgba(191,234,249,0.9) 100%)',
        border: '#bae6fd',
      }
    }

    if (condition.includes('mist') || condition.includes('fog')) {
      return {
        background: 'linear-gradient(135deg, rgba(226,232,240,0.8) 0%, rgba(237,233,254,0.92) 40%, rgba(214,228,255,0.9) 100%)',
        border: '#ddd6fe',
      }
    }

    if (condition.includes('clear')) {
      return {
        background: 'linear-gradient(135deg, rgba(254,249,195,0.9) 0%, rgba(253,224,71,0.8) 28%, rgba(254,215,170,0.9) 100%)',
        border: '#fcd34d',
      }
    }

    return {
      background: 'linear-gradient(135deg, rgba(220,252,231,0.95) 0%, rgba(209,250,229,0.9) 35%, rgba(187,247,208,0.85) 100%)',
      border: '#bbf7d0',
    }
  })()

  useEffect(() => {
    async function fetchWeather() {
      try {
        const { lat, lon } = await getUserLocation()
        const data = await getWeather(lat, lon)
        setWeather(data)
      } catch (err) {
        setWeatherError('Weather unavailable')
      }
    }
    fetchWeather()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function handleFileSelected(file) {
    setLoading(true)
    setError(null)
    setPlant(null)
    setDisease(null)
    setSavedPlantId(null)
    setSaveError(null)
    try {
      const [plantResult, diseaseResult] = await Promise.all([
        identifyPlant(file),
        checkDisease(file),
      ])
      setPlant(plantResult)
      setDisease(diseaseResult)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      const result = await saveDiagnosis({
        plant_scientific_name: plant.scientific_name,
        plant_common_name: plant.common_name,
        disease_label: disease.label,
        is_healthy: disease.is_healthy,
        confidence: disease.confidence,
        explanation: '',
      })
      setSavedPlantId(result.plant_id)
    } catch (err) {
      setSaveError('Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f2fdf3_0%,_#e6f8eb_28%,_#dff3df_52%,_#edf7ef_100%)] flex flex-col px-3 py-2">

      <div className="flex justify-between items-center mb-3 flex-shrink-0 rounded-2xl border border-green-200/70 bg-white/60 backdrop-blur-sm px-3 py-2 shadow-sm">
        <button
          onClick={handleLogout}
          className="bg-green-600 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
        >
          Log out
        </button>

        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 px-3 py-1.5 shadow-md">
          <span className="text-sm">🌿</span>
          <p className="text-sm font-extrabold tracking-tight text-white">PlantCare AI</p>
        </div>

        <button
          onClick={onViewDashboard}
          className="bg-green-600 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
        >
          Dashboard →
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-2 overflow-hidden">

        {/* Column 1 — upload + identification */}
        <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-2">
            <ImageUpload onFileSelected={handleFileSelected} compact />
          </div>

          {loading && <p className="text-xs text-green-600 text-center">Analyzing...</p>}
          {error && <p className="text-xs text-red-600 text-center">{error}</p>}

          {plant && (
            <div className="bg-white border border-gray-100 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-400 mb-0.5">🔍 Species</p>
              <p className="text-sm font-medium text-gray-800">{plant.common_name}</p>
              <p className="text-[10px] text-gray-400">{plant.confidence}% confidence</p>
            </div>
          )}

          {disease && (
            <div className="bg-white border border-gray-100 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-400 mb-0.5">
                {disease.is_healthy ? '✅ Status' : '⚠️ Disease'}
              </p>
              <p className="text-sm font-medium text-gray-800">
                {disease.is_healthy ? 'Healthy' : disease.label}
              </p>
              <p className="text-[10px] text-gray-400">{disease.confidence}% confidence</p>
            </div>
          )}

          {plant && disease && !savedPlantId && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white text-xs py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save to my plants'}
            </button>
          )}
          {savedPlantId && <p className="text-[11px] text-green-700 text-center">✓ Saved</p>}
          {saveError && <p className="text-[11px] text-red-600 text-center">{saveError}</p>}
        </div>

        {/* Column 2 — context: weather + sustainability + watering */}
        <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
          {weather && (
            <div
              className="weather-gradient rounded-xl p-3 shadow-sm border"
              style={{
                background: weatherTheme.background,
                borderColor: weatherTheme.border,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-green-700 font-semibold">Weather</p>
                  <p className="text-[10px] text-gray-500 mt-1">Today in</p>
                  <span className="inline-flex items-center rounded-full bg-green-600/10 border border-green-200 px-2 py-0.5 text-[10px] font-medium text-green-800 mt-0.5">
                    📍 {weather.location || 'Your area'}
                  </span>
                </div>
                <span className="text-xl">
                  {weather.condition?.toLowerCase().includes('rain') ? '🌧️' :
                    weather.condition?.toLowerCase().includes('cloud') ? '☁️' :
                    weather.condition?.toLowerCase().includes('clear') ? '☀️' :
                    weather.condition?.toLowerCase().includes('mist') || weather.condition?.toLowerCase().includes('fog') ? '🌫️' :
                    weather.condition?.toLowerCase().includes('storm') ? '⛈️' :
                    weather.condition?.toLowerCase().includes('snow') ? '❄️' : '🌤️'}
                </span>
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-800">{Math.round(weather.temperature)}°C</span>
                <span className="text-[11px] text-gray-600 pb-1">{weather.condition}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600">
                <div className="bg-white/80 rounded-lg p-2">
                  <p className="text-gray-400 mb-0.5">Humidity</p>
                  <p className="font-semibold text-gray-800">{Math.round(weather.humidity)}%</p>
                </div>
                <div className="bg-white/80 rounded-lg p-2">
                  <p className="text-gray-400 mb-0.5">Rain</p>
                  <p className="font-semibold text-gray-800">{Math.round(weather.rain_probability)}%</p>
                </div>
              </div>

              <p className="mt-2 text-[10px] text-gray-600 leading-relaxed">
                {weather.rain_probability >= 50
                  ? 'Rain is likely, so watering can wait for now.'
                  : weather.humidity < 40
                    ? 'Dry air and low humidity may mean your plants need a check.'
                    : 'Conditions look fairly balanced for plant care today.'}
              </p>
            </div>
          )}
          {weatherError && <p className="text-[11px] text-gray-400 text-center">{weatherError}</p>}

          <div className="text-xs">
            <SustainabilityCard />
          </div>

          {plant && <WateringCheck plant={plant} weather={weather} plantId={savedPlantId} />}
        </div>

        {/* Column 3 — AI Plant Doctor (scrolls internally only, if needed) */}
        <div className="min-h-0 overflow-y-auto">
          {plant && disease && <PlantDoctor plant={plant} disease={disease} weather={weather} />}
        </div>

      </div>
    </div>
  )
}