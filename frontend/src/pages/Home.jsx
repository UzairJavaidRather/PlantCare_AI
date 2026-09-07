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
    <div className="app-shell flex min-h-screen flex-col overflow-x-hidden px-3 py-3 sm:px-5">

      <div className="rise-in mx-auto mb-4 flex w-full max-w-[1400px] shrink-0 items-center justify-between rounded-2xl border border-white/80 bg-[#fffdf5]/75 px-3 py-2.5 shadow-[0_10px_30px_rgba(31,77,57,0.08)] backdrop-blur-xl">
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-[#6d7b70] transition hover:bg-[#edf3e8] hover:text-[#173b31]"
        >
          Exit garden
        </button>

        <div className="flex items-center gap-2 rounded-full bg-[#173b31] px-4 py-2 shadow-[0_8px_20px_rgba(23,59,49,0.2)]">
          <span className="text-sm text-[#e7c56f]">✦</span>
          <p className="text-sm font-bold tracking-tight text-[#fffdf5]">PlantCare AI</p>
        </div>

        <button
          onClick={onViewDashboard}
          className="rounded-lg bg-[#d6a33d] px-3 py-1.5 text-[11px] font-bold text-[#173b31] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#e2b653]"
        >
          Your dashboard <span aria-hidden="true">↗</span>
        </button>
      </div>

      <section className="welcome-hero rise-in rise-in-delay-1 mx-auto mb-4 w-full max-w-[1400px] shrink-0 rounded-[1.25rem] px-5 py-4 text-[#fffdf5] shadow-[0_16px_34px_rgba(23,59,49,0.18)] sm:px-7 sm:py-5">
        <div className="relative z-[1] max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e7c56f]">Your intelligent plant companion</p>
          <h1 className="display-font mt-1 text-3xl leading-tight sm:text-4xl">Let’s see what’s growing today.</h1>
          <p className="mt-2 max-w-lg text-xs leading-5 text-[#d7e6d5] sm:text-sm">
            Upload a leaf photo and we’ll help you understand your plant, spot signs of stress, and choose its next best care step.
          </p>
        </div>
        <div className="relative z-[1] mt-4 flex items-center gap-2 text-[10px] font-semibold text-[#e7c56f] sm:absolute sm:bottom-5 sm:right-7 sm:mt-0">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#e7c56f]" /> Ready when you are
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-start gap-5 pb-6 md:grid-cols-3">

        {/* Column 1 — upload + identification */}
        <div className="flex min-w-0 flex-col gap-3 rise-in rise-in-delay-1">
          <div className="flex items-center gap-2 px-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173b31] text-xs text-[#e7c56f]">01</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b88628]">Start here</p>
              <p className="text-xs font-semibold text-[#345046]">Diagnose a plant</p>
            </div>
          </div>
          <div className="surface-lift rounded-2xl border border-white/90 bg-[#fffdf5]/80 p-2 shadow-[0_10px_28px_rgba(31,77,57,0.08)] backdrop-blur-xl">
            <ImageUpload onFileSelected={handleFileSelected} compact />
          </div>

          {loading && (
            <div className="analysis-state flex items-center gap-3 rounded-xl border border-[#e6dec1] bg-[#fff9e8]/90 px-3 py-2.5 text-[#173b31] shadow-sm">
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#d6a33d]/35 text-sm text-[#b88628]">
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#b88628]" />
                ✦
              </span>
              <span className="relative">
                <strong className="block text-xs font-bold">Reading your leaf</strong>
                <span className="text-[10px] text-[#6d7b70]">Checking species and signs of stress...</span>
              </span>
            </div>
          )}
          {error && <p className="text-xs text-red-600 text-center">{error}</p>}

          {plant && (
            <div className="surface-lift rounded-2xl border border-[#d9e7d7] bg-[#f4f8ed]/90 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b88628] mb-1">Species found</p>
              <p className="display-font text-xl text-[#173b31]">{plant.common_name}</p>
              <p className="text-[10px] text-[#6d7b70]">{plant.confidence}% confidence</p>
            </div>
          )}

          {disease && (
            <div className="surface-lift rounded-2xl border border-[#e6dec1] bg-[#fff9e8]/90 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b88628] mb-1">
                {disease.is_healthy ? 'Plant status' : 'Attention needed'}
              </p>
              <p className="text-sm font-bold text-[#173b31]">
                {disease.is_healthy ? 'Healthy' : disease.label}
              </p>
              <p className="text-[10px] text-[#6d7b70]">{disease.confidence}% confidence</p>
            </div>
          )}

          {plant && disease && !savedPlantId && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-[#173b31] py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#245b46] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save to my plants'}
            </button>
          )}
          {savedPlantId && (
            <p className="success-badge mx-auto flex w-fit items-center gap-2 rounded-full border border-[#c9dfcc] bg-[#edf5e9] px-3 py-1.5 text-[11px] font-bold text-[#2d7756]" role="status">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2d7756] text-[9px] text-white">✓</span>
              Added to your garden
            </p>
          )}
          {saveError && <p className="text-[11px] text-red-600 text-center">{saveError}</p>}
        </div>

        {/* Column 2 — context: weather + sustainability + watering */}
        <div className="flex min-w-0 flex-col gap-3 rise-in rise-in-delay-2">
          <div className="flex items-center gap-2 px-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6a33d] text-xs font-bold text-[#173b31]">02</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b88628]">Read the signs</p>
              <p className="text-xs font-semibold text-[#345046]">Today’s care context</p>
            </div>
          </div>
          {weather && (
            <div
              className="weather-gradient h-auto min-h-[270px] rounded-2xl border p-4 shadow-[0_12px_30px_rgba(31,77,57,0.1)] md:min-h-0"
              style={{
                background: weatherTheme.background,
                borderColor: weatherTheme.border,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-700">Today’s atmosphere</p>
                  <p className="mt-1 text-[10px] text-gray-500">A little context for your care routine</p>
                  <span className="mt-2 inline-flex items-center rounded-full border border-green-200 bg-green-600/10 px-2 py-0.5 text-[10px] font-semibold text-green-800">
                    📍 {weather.location || 'Your area'}
                  </span>
                </div>
                <span className="weather-icon">
                  {weather.condition?.toLowerCase().includes('rain') ? '🌧️' :
                    weather.condition?.toLowerCase().includes('cloud') ? '☁️' :
                    weather.condition?.toLowerCase().includes('clear') ? '☀️' :
                    weather.condition?.toLowerCase().includes('mist') || weather.condition?.toLowerCase().includes('fog') ? '🌫️' :
                    weather.condition?.toLowerCase().includes('storm') ? '⛈️' :
                    weather.condition?.toLowerCase().includes('snow') ? '❄️' : '🌤️'}
                </span>
              </div>

              <div className="mb-3 flex items-end gap-3">
                <span className="text-4xl font-bold tracking-tight text-gray-800">{Math.round(weather.temperature)}°</span>
                <div className="pb-1">
                  <span className="block text-[11px] font-bold text-gray-700">Celsius</span>
                  <span className="block text-[11px] text-gray-600">{weather.condition}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600">
                <div className="rounded-xl border border-white/60 bg-white/60 p-2.5">
                  <p className="mb-1 text-gray-500">Humidity</p>
                  <p className="text-base font-bold text-gray-800">{Math.round(weather.humidity)}<span className="text-[10px]">%</span></p>
                </div>
                <div className="rounded-xl border border-white/60 bg-white/60 p-2.5">
                  <p className="mb-1 text-gray-500">Rain chance</p>
                  <p className="text-base font-bold text-gray-800">{Math.round(weather.rain_probability)}<span className="text-[10px]">%</span></p>
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
          {!weather && !weatherError && (
            <div className="animate-pulse rounded-2xl border border-[#d9e7d7] bg-[#f4f8ed]/80 p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-2.5 w-28 rounded-full bg-[#c9dfcc]" />
                  <div className="h-2 w-40 rounded-full bg-[#d9e7d7]" />
                  <div className="h-5 w-24 rounded-full bg-[#d9e7d7]" />
                </div>
                <div className="h-12 w-12 rounded-2xl bg-[#d9e7d7]" />
              </div>
              <div className="mt-5 h-9 w-24 rounded-lg bg-[#c9dfcc]" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-14 rounded-xl bg-white/60" />
                <div className="h-14 rounded-xl bg-white/60" />
              </div>
            </div>
          )}
          {weatherError && <p className="text-[11px] text-gray-400 text-center">{weatherError}</p>}

          <div className="text-xs rise-in rise-in-delay-3">
            <SustainabilityCard />
          </div>

          {plant && <WateringCheck plant={plant} weather={weather} plantId={savedPlantId} />}
        </div>

        {/* Column 3 — AI Plant Doctor (scrolls internally only, if needed) */}
        <div className="min-w-0 rise-in rise-in-delay-3">
          <div className="mb-3 flex items-center gap-2 px-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2d7756] text-xs font-bold text-white">03</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b88628]">Keep learning</p>
              <p className="text-xs font-semibold text-[#345046]">Your plant doctor</p>
            </div>
          </div>
          {plant && disease ? (
            <PlantDoctor plant={plant} disease={disease} weather={weather} />
          ) : (
            <div className="surface-lift rounded-2xl border border-[#c9dfcc] bg-[#edf5e9]/75 p-6 shadow-[0_12px_28px_rgba(31,77,57,0.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173b31] text-xl text-[#e7c56f] shadow-md">✦</div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#2d7756]">A thoughtful second opinion</p>
              <h2 className="display-font mt-2 text-2xl leading-tight text-[#173b31]">Your plant doctor is ready.</h2>
              <p className="mt-3 text-sm leading-6 text-[#52665a]">Upload a leaf photo and you’ll get a plain-language explanation, plus a place to ask follow-up questions.</p>
              <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b88628]">
                <span className="h-2 w-2 rounded-full bg-[#d6a33d]" /> Waiting for a plant to examine
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}