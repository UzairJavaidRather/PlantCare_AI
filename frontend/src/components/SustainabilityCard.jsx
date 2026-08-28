import { useState, useEffect } from 'react'
import { getSustainability } from '../services/api'

export default function SustainabilityCard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getSustainability().then(setData).catch(() => setData(null))
  }, [])

  if (!data) return null

  return (
    <div className="mt-4 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 p-4 rounded-xl text-sm border border-emerald-200 shadow-sm">
      <p className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">🌍 Sustainability Score</p>
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl font-bold text-emerald-700">{data.sustainability_score}</div>
        <div className="text-gray-500 text-xs">/ 100</div>
      </div>
      <div className="space-y-1 text-gray-700">
        <p>💧 {data.total_water_saved_liters}L water saved</p>
        <p>🌱 {data.plants_monitored} plants monitored</p>
        <p>🩺 {data.diseases_detected} diseases caught</p>
      </div>
    </div>
  )
}