import React from 'react'
import StatCard from './components/StatCard'
import ProgressDonut from './components/ProgressDonut'
import EventsList from './components/EventsList'
import './App.css'
import './index.css'

export default function Dashboard() {
  const attended = [
    { title: 'Mindful Cooking Class', category: 'Nutrition', date: '27 Sep, 12:23 min', status: 'Attended', action: '✓' },
    { title: 'Sunset Yoga', category: 'Yoga', date: '27 Sep, 12:23 min', status: 'Attended', action: '✓' },
    { title: 'Breathwork Session', category: 'Meditation', date: '25 Sep, 10:00 min', status: 'Attended', action: '✓' },
  ]
  const upcoming = [
    { title: 'Mindful Cooking Class', category: 'Nutrition', date: '27 Sep, 12:23 min', status: 'Upcoming', action: '' },
    { title: 'Night Meditation', category: 'Meditation', date: '27 Sep, 12:23 min', status: 'Upcoming', action: '' },
    { title: 'Nature Walk', category: 'Wellness', date: '29 Sep, 14:00 min', status: 'Register Now', action: '' },
  ]
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">★</div>
          <div className="brand-name">Campus Attention</div>
        </div>
        <nav className="nav">
          <a className="active">Dashboard</a>
          <a>Settings</a>
        </nav>
        <button className="profile">
          <span className="avatar">BB</span>
          <span className="name">Bansilal</span>
        </button>
      </header>
      <main className="content">
        <section className="hero">
          <div className="hero-title">Points Dashboard</div>
          <div className="hero-subtitle">Welcome back, Bansilal</div>
        </section>
        <section className="stats-row">
          <StatCard title="Remaining Points" value="1,250" subtitle="Points for redemption" />
          <StatCard title="Points Spent" value="750" subtitle="This month" />
        </section>
        <section className="goal-row">
          <ProgressDonut percent={80} label="Daily Wellness Goal" sublabel="80/100 points for today" />
        </section>
        <section className="events-section">
          <EventsList attended={attended} upcoming={upcoming} />
        </section>
      </main>
      <footer className="footer">
        <div>Terms</div>
        <div>Privacy</div>
        <div className="social">ⓕ ⓣ ⓘ</div>
      </footer>
    </div>
  )
}
