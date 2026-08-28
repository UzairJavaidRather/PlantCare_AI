import { useState, useEffect } from 'react'
import { getPlantDoctorExplanation, askPlantQuestion } from '../services/api'

export default function PlantDoctor({ plant, disease, weather }) {
  const [explanation, setExplanation] = useState(null)
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [asking, setAsking] = useState(false)

  useEffect(() => {
    async function fetchExplanation() {
      setLoadingExplanation(true)
      try {
        const result = await getPlantDoctorExplanation({
          plant_name: plant.common_name,
          disease_label: disease.label,
          is_healthy: disease.is_healthy,
          confidence: disease.confidence,
          temperature: weather?.temperature,
          humidity: weather?.humidity,
        })
        setExplanation(result.explanation)
      } catch (err) {
        setExplanation('Could not load explanation right now.')
      } finally {
        setLoadingExplanation(false)
      }
    }
    fetchExplanation()
  }, [plant, disease, weather])  // re-run when plant, disease, or weather changes

  async function handleAsk() {
    if (!question.trim()) return
    setAsking(true)
    try {
      const result = await askPlantQuestion({
        plant_name: plant.common_name,
        disease_label: disease.label,
        question,
      })
      setAnswer(result.answer)
    } catch (err) {
      setAnswer('Could not get an answer right now.')
    } finally {
      setAsking(false)
    }
  }

  return (
    <div className="mt-4 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 rounded-xl text-sm border border-emerald-200 shadow-sm">
      <p className="font-semibold text-emerald-900 mb-2">🩺 AI Plant Doctor</p>
      {loadingExplanation && <p className="text-gray-500">Thinking...</p>}
      {explanation && <p className="text-gray-700 whitespace-pre-line">{explanation}</p>}

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your plant..."
          className="flex-1 border border-emerald-200 rounded-lg px-2 py-1.5 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
        <button
          onClick={handleAsk}
          disabled={asking}
          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 hover:bg-green-700 transition-colors"
        >
          {asking ? '...' : 'Ask'}
        </button>
      </div>
      {answer && <p className="mt-2 text-gray-700 whitespace-pre-line">{answer}</p>}
    </div>
  )
}