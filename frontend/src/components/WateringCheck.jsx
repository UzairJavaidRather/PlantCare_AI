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
      <div className="bg-white border border-gray-100 rounded-xl p-3.5 text-sm text-gray-400">
        Watering advice needs weather data — enable location to see this.
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-lime-50 to-emerald-50 border border-lime-200 rounded-xl p-3.5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">💧 Watering check</p>
      {loading && <p className="text-sm text-gray-400">Checking...</p>}
      {result && (
        <>
          <p className="text-sm font-semibold text-gray-800">
            {result.water_needed ? 'Water needed' : 'No watering needed'}
          </p>
          <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">{result.recommendation}</p>
        </>
      )}
    </div>
  )
}