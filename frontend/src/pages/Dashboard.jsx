import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { getPlantHistory, getDiagnosisHistory, getWateringHistory } from '../services/api'

const COLORS = ['#16a34a', '#dc2626']  // healthy green, disease red

export default function Dashboard({ onBack }) {
  const [plants, setPlants] = useState([])
  const [diagnoses, setDiagnoses] = useState([])
  const [watering, setWatering] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAll() {
      try {
        const [p, d, w] = await Promise.all([
          getPlantHistory(),
          getDiagnosisHistory(),
          getWateringHistory(),
        ])
        setPlants(p)
        setDiagnoses(d)
        setWatering(w)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // Build chart-ready data from raw rows
  const healthyCount = diagnoses.filter((d) => d.is_healthy).length
  const diseasedCount = diagnoses.length - healthyCount
  const totalWaterSaved = watering.reduce(
    (total, entry) => total + (entry.estimated_water_saved_liters || 0),
    0,
  )
  const healthRate = diagnoses.length ? Math.round((healthyCount / diagnoses.length) * 100) : 0
  const latestPlant = plants[0]
  const healthPieData = [
    { name: 'Healthy', value: healthyCount },
    { name: 'Diseased', value: diseasedCount },
  ]

  // Cumulative water saved over time, oldest first for a left-to-right chart
  const wateringSorted = [...watering].reverse()
  let runningTotal = 0
  const waterLineData = wateringSorted.map((w, i) => {
    runningTotal += w.estimated_water_saved_liters
    return {
      index: i + 1,
      liters: Math.round(runningTotal * 100) / 100,
    }
  })

  if (loading) {
    return <div className="app-shell min-h-screen flex items-center justify-center text-sm text-[#6d7b70]">Loading your garden...</div>
  }

  return (
    <div className="app-shell min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="rise-in mb-6 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="rounded-full border border-white/90 bg-[#fffdf5]/80 px-3.5 py-2 text-sm font-semibold text-[#2d7756] shadow-sm backdrop-blur-sm transition hover:-translate-x-0.5 hover:bg-white"
          >
            ← Back to upload
          </button>

          <div className="flex items-center gap-2 rounded-full bg-[#173b31] px-4 py-2 shadow-md">
            <span className="text-base text-[#e7c56f]">✦</span>
            <h1 className="text-lg font-extrabold tracking-tight text-[#fffdf5]">Your garden</h1>
          </div>
        </div>

        <section className="rise-in mb-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b88628]">Garden pulse</p>
            <h2 className="display-font mt-2 max-w-xl text-4xl leading-tight text-[#173b31] sm:text-5xl">
              Small observations, healthier growth.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#6d7b70]">
              A quiet record of the care you have given your plants and the patterns you are learning along the way.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e6dec1] bg-[#fff9e8]/85 px-4 py-3 text-right shadow-sm backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a661c]">Care checks</p>
            <p className="display-font mt-1 text-3xl text-[#173b31]">{diagnoses.length + watering.length}</p>
            <p className="text-xs text-[#8a8063]">moments logged</p>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="surface-lift rise-in rise-in-delay-1 rounded-2xl border border-[#c9dfcc] bg-[#edf5e9]/90 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2d7756]">Plants in care</p>
            <p className="display-font mt-2 text-4xl text-[#173b31]">{plants.length}</p>
            <p className="mt-1 text-xs text-[#6d7b70]">saved to your garden</p>
          </div>
          <div className="surface-lift rise-in rise-in-delay-2 rounded-2xl border border-[#e6dec1] bg-[#fff9e8]/90 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a661c]">Water saved</p>
            <p className="display-font mt-2 text-4xl text-[#173b31]">{Math.round(totalWaterSaved * 10) / 10}<span className="ml-1 text-lg">L</span></p>
            <p className="mt-1 text-xs text-[#8a8063]">through thoughtful timing</p>
          </div>
          <div className="surface-lift rise-in rise-in-delay-3 rounded-2xl border border-[#c9dfcc] bg-[#edf5e9]/90 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2d7756]">Healthy signals</p>
            <p className="display-font mt-2 text-4xl text-[#173b31]">{healthRate}<span className="ml-1 text-lg">%</span></p>
            <p className="mt-1 text-xs text-[#6d7b70]">of recorded diagnoses</p>
          </div>
        </section>

        <section className="garden-note rise-in mb-6 rounded-2xl border border-[#d9e7d7] bg-[#f4f8ed]/90 px-5 py-4 shadow-[0_12px_28px_rgba(31,77,57,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2d7756]">A note for your garden</p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#345046]">
            {latestPlant
              ? `${latestPlant.common_name || latestPlant.scientific_name} is part of your care story now. Keep observing the small changes; they are often the most useful ones.`
              : 'Your first plant will become the beginning of your care story. Upload a leaf photo to start observing.'}
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="surface-lift rise-in rise-in-delay-1 rounded-2xl border border-white/90 bg-[#fffdf5]/80 p-6 shadow-[0_12px_35px_rgba(31,77,57,0.1)] backdrop-blur-md">
            <h2 className="display-font text-2xl text-[#173b31] mb-3">Water saved over time</h2>
            {waterLineData.length === 0 ? (
              <p className="text-sm text-gray-400">No watering checks logged yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={waterLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="index" label={{ value: 'Check #', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Liters', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="liters" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="surface-lift rise-in rise-in-delay-2 rounded-2xl border border-white/90 bg-[#fffdf5]/80 p-6 shadow-[0_12px_35px_rgba(31,77,57,0.1)] backdrop-blur-md">
            <h2 className="display-font text-2xl text-[#173b31] mb-3">Plant health breakdown</h2>
            {diagnoses.length === 0 ? (
              <p className="text-sm text-gray-400">No diagnoses logged yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={healthPieData} dataKey="value" nameKey="name" outerRadius={70} label>
                    {healthPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="surface-lift rise-in rise-in-delay-3 rounded-2xl border border-white/90 bg-[#fffdf5]/80 p-6 shadow-[0_12px_35px_rgba(31,77,57,0.1)] backdrop-blur-md">
          <h2 className="display-font text-2xl text-[#173b31] mb-3">Plants monitored <span className="font-sans text-sm text-[#b88628]">({plants.length})</span></h2>
          {plants.length === 0 ? (
            <p className="text-sm text-gray-400">No plants saved yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {plants.map((p) => (
                <li key={p.id} className="py-3 flex justify-between items-center">
                  <span className="font-medium text-gray-700">{p.common_name || p.scientific_name}</span>
                  <span className="text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}