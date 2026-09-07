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
    <div className="surface-lift mt-4 rounded-2xl border border-[#c9dfcc] bg-[#edf5e9]/90 p-4 text-sm shadow-[0_12px_28px_rgba(31,77,57,0.09)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-bold uppercase tracking-[0.12em] text-[#2d7756]">AI Plant Doctor</p>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#173b31] text-xs text-[#e7c56f]">✦</span>
      </div>
      {loadingExplanation && <p className="animate-pulse text-[#6d7b70]">Thinking gently...</p>}
      {explanation && <p className="leading-6 text-[#345046] whitespace-pre-line">{explanation}</p>}

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your plant..."
          className="flex-1 rounded-xl border border-[#c9dfcc] bg-white/80 px-3 py-2 text-sm text-[#173b31] outline-none transition focus:border-[#b88628] focus:ring-4 focus:ring-[#d6a33d]/15"
        />
        <button
          onClick={handleAsk}
          disabled={asking}
          className="rounded-xl bg-[#173b31] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#245b46] disabled:opacity-50"
        >
          {asking ? '...' : 'Ask'}
        </button>
      </div>
      {answer && <p className="mt-3 border-t border-[#c9dfcc] pt-3 text-[#345046] whitespace-pre-line">{answer}</p>}
    </div>
  )
}