import { useState, useEffect } from 'react'
import { checkWatering } from '../services/api'

export default function WateringCheck({ plant, weather, plantId }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchWatering() {
      if (!weather) return
      setLoading(true)
      try {
        const data = await checkWatering(
          {
            plant_type: plant.common_name,
            temperature: weather.temperature,
            humidity: weather.humidity,
            rain_probability: weather.rain_probability,
          },
          plantId
        )
        setResult(data)
      } catch (err) {
        setResult(null)
      } finally {
        setLoading(false)
      }
    }
    fetchWatering()
  }, [plant, weather, plantId])

  if (!weather) {
    return (
      <div className="rounded-2xl border border-white/80 bg-[#fffdf5]/75 p-4 text-sm text-[#6d7b70] shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b88628]">Watering rhythm</p>
        <p className="mt-2 leading-5">Watering advice will appear once local weather is available.</p>
      </div>
    )
  }

  return (
    <div className="surface-lift rounded-2xl border border-[#c9dfcc] bg-[#edf5e9]/90 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d7756]">Watering rhythm</p>
          <p className="mt-1 text-xs text-[#6d7b70]">A gentle check for today</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173b31] text-base text-[#e7c56f]">⌁</span>
      </div>
      {loading && (
        <div className="mt-4 animate-pulse space-y-2">
          <div className="h-3 w-28 rounded-full bg-[#c9dfcc]" />
          <div className="h-2.5 w-full rounded-full bg-[#d9e7d7]" />
          <div className="h-2.5 w-4/5 rounded-full bg-[#d9e7d7]" />
        </div>
      )}
      {result && (
        <>
          <div className="mt-4 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${result.water_needed ? 'bg-[#d6a33d]' : 'bg-[#2d7756]'}`} />
            <p className="text-sm font-bold text-[#173b31]">{result.water_needed ? 'Water needed' : 'No watering needed'}</p>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-[#52665a]">{result.recommendation}</p>
        </>
      )}
    </div>
  )
}