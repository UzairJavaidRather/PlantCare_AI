import { useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    onLoggedIn(data.session)
  }

  return (
    <div className="app-shell min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid md:grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-4xl border border-white/80 bg-[#fffdf5]/80 shadow-[0_24px_80px_rgba(31,77,57,0.16)] backdrop-blur-xl rise-in">
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-[#173b31] p-10 text-[#fffdf5]">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-30 border-[#d6a33d]/25" />
          <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-[#2d7756]/70 blur-2xl" />
          <div className="relative">
            <div className="mb-12 flex items-center gap-3 text-sm font-semibold tracking-[0.18em] uppercase text-[#e7c56f]">
              <span className="text-2xl">✦</span> PlantCare AI
            </div>
            <h2 className="display-font max-w-sm text-5xl leading-[1.05]">A calmer way to care for what grows.</h2>
            <p className="mt-5 max-w-xs text-sm leading-7 text-[#d7e6d5]">Understand your plants, catch problems early, and build better daily habits with a little help from AI.</p>
          </div>
          <p className="relative text-xs tracking-wide text-[#abc8b3]">Observe · nurture · flourish</p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 sm:p-10">
          <div className="mb-8 md:hidden text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#b88628]">✦ PlantCare AI</p>
          </div>
          <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#b88628]">Welcome back</p>
          <h1 className="display-font mt-2 text-4xl text-[#173b31]">{isSignup ? 'Start your garden story' : 'Let’s grow together'}</h1>
          <p className="mt-3 text-sm text-[#6d7b70]">{isSignup ? 'Create your space for thoughtful plant care.' : 'Your plants have been waiting for you.'}</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-8 w-full rounded-xl border border-[#d7dfd2] bg-white/70 px-4 py-3 text-sm text-[#173b31] outline-none transition focus:border-[#b88628] focus:ring-4 focus:ring-[#d6a33d]/15"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-3 w-full rounded-xl border border-[#d7dfd2] bg-white/70 px-4 py-3 text-sm text-[#173b31] outline-none transition focus:border-[#b88628] focus:ring-4 focus:ring-[#d6a33d]/15"
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-xl bg-[#173b31] py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(23,59,49,0.18)] transition hover:-translate-y-0.5 hover:bg-[#245b46] disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
        </button>

        <p className="mt-6 text-center text-sm text-[#6d7b70]">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="font-semibold text-[#b88628] underline decoration-[#d6a33d]/50 underline-offset-4"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </form>
    </div>
    </div>
  )
}