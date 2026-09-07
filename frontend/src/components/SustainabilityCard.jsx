import { useState, useEffect } from 'react'
import { getSustainability } from '../services/api'

export default function SustainabilityCard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSustainability()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mt-4 animate-pulse rounded-2xl border border-[#e6dec1] bg-[#fff9e8]/80 p-4 shadow-sm">
        <div className="h-2.5 w-36 rounded-full bg-[#e6dec1]" />
        <div className="mt-4 h-14 w-full rounded-xl bg-[#f2e8c7]" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-8 rounded-lg bg-[#f2e8c7]" />
          <div className="h-8 rounded-lg bg-[#f2e8c7]" />
          <div className="h-8 rounded-lg bg-[#f2e8c7]" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const score = Math.max(0, Math.min(100, Number(data.sustainability_score) || 0))

  return (
    <div className="surface-lift mt-4 rounded-2xl border border-[#e6dec1] bg-[#fff9e8]/90 p-4 text-sm shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a661c]">Sustainability score</p>
          <p className="mt-2 max-w-[10rem] text-xs leading-5 text-[#8a8063]">Every thoughtful check adds up.</p>
        </div>
        <div className="score-ring" style={{ '--score': `${score}%` }}>
          <div className="score-ring-content">
            <div className="display-font text-2xl leading-none text-[#173b31]">{score}</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#8a8063]">impact</div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#e6dec1] pt-3">
        <div>
          <p className="text-base font-bold text-[#173b31]">{data.total_water_saved_liters}L</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-wide text-[#8a8063]">saved</p>
        </div>
        <div>
          <p className="text-base font-bold text-[#173b31]">{data.plants_monitored}</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-wide text-[#8a8063]">plants</p>
        </div>
        <div>
          <p className="text-base font-bold text-[#173b31]">{data.diseases_detected}</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-wide text-[#8a8063]">caught early</p>
        </div>
      </div>
    </div>
  )
}