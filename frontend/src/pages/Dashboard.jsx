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
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-[radial-gradient(circle_at_top,_rgba(162,240,184,0.55),_transparent_25%),linear-gradient(135deg,_#f2fff5_0%,_#ebf9ee_35%,_#e4f4ea_100%)]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="bg-white/80 text-green-700 text-sm font-medium px-3.5 py-2 rounded-full border border-green-200 shadow-sm hover:bg-green-50 transition-colors backdrop-blur-sm"
          >
            ← Back to upload
          </button>

          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 px-4 py-2 shadow-md">
            <span className="text-base">🌿</span>
            <h1 className="text-lg font-extrabold tracking-tight text-white">Your Dashboard</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/75 backdrop-blur-md rounded-2xl shadow-[0_12px_35px_rgba(16,185,129,0.12)] p-6 border border-green-100">
            <h2 className="font-semibold text-gray-700 mb-3">Water Saved Over Time</h2>
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

          <div className="bg-white/75 backdrop-blur-md rounded-2xl shadow-[0_12px_35px_rgba(16,185,129,0.12)] p-6 border border-green-100">
            <h2 className="font-semibold text-gray-700 mb-3">Plant Health Breakdown</h2>
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

        <div className="bg-white/75 backdrop-blur-md rounded-2xl shadow-[0_12px_35px_rgba(16,185,129,0.12)] p-6 border border-green-100">
          <h2 className="font-semibold text-gray-700 mb-3">Plants Monitored ({plants.length})</h2>
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