import { useState, useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [view, setView] = useState('home')  // 'home' | 'dashboard'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCheckingSession(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (checkingSession) return null
  if (!session) return <Login onLoggedIn={setSession} />

  return view === 'dashboard'
    ? <Dashboard onBack={() => setView('home')} />
    : <Home session={session} onViewDashboard={() => setView('dashboard')} />
}

export default App