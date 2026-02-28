import React, { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import Settings from './components/Settings'
import LoginPage from './components/LoginPage'
import PreferencePage from './components/PreferencePage'
import WeeklyEventsPage from './components/WeeklyEventsPage'
import './index.css'
import './App.css'

export default function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      setPage('dashboard')
    }
  }, [])

  const handleLogin = (userData, isNewUser) => {
    setUser(userData)
    // New signups OR weekly reset due go to preference selection first
    if (isNewUser || userData.needsWeeklyReset) {
      setPage('preferences')
    } else {
      setPage('dashboard')
    }
  }

  const handlePreferenceDone = () => {
    setPage('weekly-onboarding')
  }

  const handleWeeklyOnboardingDone = () => {
    setPage('dashboard')
  }

  const handleUserUpdate = (updatedProfile) => {
    const newUser = { ...user, ...updatedProfile }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const handleNavigate = (target) => {
    if (target === 'logout') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setPage('login')
    } else {
      setPage(target)
    }
  }

  if (page === 'login') return <LoginPage onLogin={handleLogin} />
  if (page === 'preferences') return <PreferencePage onComplete={handlePreferenceDone} />
  if (page === 'weekly-onboarding') return <WeeklyEventsPage onComplete={handleWeeklyOnboardingDone} />
  if (page === 'settings') return <Settings onNavigate={handleNavigate} onUserUpdate={handleUserUpdate} />
  return <Dashboard onNavigate={handleNavigate} />
}
