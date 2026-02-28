import React, { useState, useEffect } from 'react'
import StatCard from './components/StatCard'
import ProgressDonut from './components/ProgressDonut'
import EventsList from './components/EventsList'
import DashboardCalendar from './components/DashboardCalendar'
import './App.css'
import './index.css'

export default function Dashboard({ onNavigate }) {
  // ... existing state ...
  const [dashboardData, setDashboardData] = useState({
    profile: { name: '...', avatar: '?', email: '' },
    points: { current: 0, spent: 0, dailyWellness: 0 },
    events: {
      attended: [],
      upcoming: []
    }
  });

  useEffect(() => {
    // In production, token comes from AuthContext
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/user/dashboard', {
      headers: { 'x-auth-token': token || '' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.profile) setDashboardData(data);
      })
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, []);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">★</div>
          <div className="brand-name">Campus Attention</div>
        </div>
        <nav className="nav">
          <a className="active" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>Dashboard</a>
          <a style={{ cursor: 'pointer' }} onClick={() => onNavigate('settings')}>Settings</a>
        </nav>
        <button className="profile">
          <span className="avatar">{dashboardData.profile.avatar}</span>
          <span className="name">{dashboardData.profile.name}</span>
        </button>
      </header>
      <main className="content">
        <section className="hero">
          <div className="hero-title">Hello {dashboardData.profile.name}!</div>
          <div className="hero-subtitle">Your weekly performance at a glance</div>
        </section>
        <div className="dashboard-grid">
          <div className="left-panel">
            <section className="stats-row">
              <StatCard title="Remaining Points" value={dashboardData.points.current.toLocaleString()} subtitle="Points for redemption" />
              <StatCard title="Points Spent" value={dashboardData.points.spent.toLocaleString()} subtitle="This month" />
            </section>
            <section className="goal-row">
              <ProgressDonut percent={dashboardData.points.dailyWellness} label="Daily Wellness Goal" sublabel={`${dashboardData.points.dailyWellness}/100 points for today`} />
            </section>
            <section className="events-section">
              <EventsList attended={dashboardData.events.attended} upcoming={dashboardData.events.upcoming} />
            </section>
          </div>
          <div className="right-panel">
            <section className="calendar-section">
              <div className="hero-subtitle" style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Activity Calendar</div>
              <DashboardCalendar events={[...dashboardData.events.attended, ...dashboardData.events.upcoming]} />
            </section>
          </div>
        </div>
      </main>
      <footer className="footer">
        <div>Terms</div>
        <div>Privacy</div>
        <div className="social">ⓕ ⓣ ⓘ</div>
      </footer>
    </div>
  )
}


