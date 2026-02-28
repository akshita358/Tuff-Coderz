import React, { useState, useEffect } from 'react'
import StatCard from './components/StatCard'
import ProgressDonut from './components/ProgressDonut'
import EventsList from './components/EventsList'
import DashboardCalendar from './components/DashboardCalendar'
import AddEventModal from './components/AddEventModal'
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddEvent = async (event) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/user/events/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({ events: [event] })
      });
      if (res.ok) {
        // Refresh data
        const refreshRes = await fetch('http://localhost:5000/api/user/dashboard', {
          headers: { 'x-auth-token': token || '' }
        });
        const newData = await refreshRes.json();
        setDashboardData(newData);
      }
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const handleStatusUpdate = async (eventId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/user/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Refresh data
        const refreshRes = await fetch('http://localhost:5000/api/user/dashboard', {
          headers: { 'x-auth-token': token || '' }
        });
        const newData = await refreshRes.json();
        setDashboardData(newData);
      }
    } catch (err) {
      console.error('Error updating event status:', err);
    }
  };

  if (!dashboardData) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <header className="topbar glass-card">
        <div className="brand">
          <div className="logo">S</div>
          <span className="title">Attention Seekers</span>
        </div>
        <nav className="nav">
          <a className="active" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>Dashboard</a>
          <a style={{ cursor: 'pointer' }} onClick={() => onNavigate('settings')}>Settings</a>
        </nav>
        <div className="topbar-actions">
          <div className="header-points-badge glass-card">
            <span className="points-icon">💎</span>
            <span className="points-val">{dashboardData.points.current} pts</span>
          </div>
          <button className="profile">
            <span className="avatar">{dashboardData.profile.avatar}</span>
            <span className="name">{dashboardData.profile.name}</span>
          </button>
        </div>
      </header>
      <main className="content">
        <section className="hero">
          <div className="hero-title">Hello {dashboardData.profile.name}!</div>
          <div className="hero-subtitle">You have <span className="pts-highlight">{dashboardData.points.current} points</span> left to spend this week! 💎</div>
        </section>
        <div className="dashboard-grid">
          <div className="left-panel">
            <section className="stats-row">
              <StatCard
                title="Weekly Allotment"
                value="100"
                subtitle="Starting budget"
                className="allotment"
              />
              <StatCard
                title="Points Deducted"
                value={dashboardData.points.spent.toLocaleString()}
                subtitle="Spent on events"
                className="spent"
              />
              <StatCard
                title="Remaining Balance"
                value={dashboardData.points.current.toLocaleString()}
                subtitle="Available now"
                className="remaining"
              />
            </section>
            <section className="events-section">
              <EventsList
                attended={dashboardData.events.attended}
                upcoming={dashboardData.events.upcoming}
                onStatusUpdate={handleStatusUpdate}
              />
            </section>
          </div>
          <div className="right-panel">
            <section className="calendar-section">
              <div className="hero-subtitle" style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Activity Calendar</div>
              <DashboardCalendar events={[...dashboardData.events.attended, ...dashboardData.events.upcoming]} />
              <button
                className="add-event-fab glass-card"
                onClick={() => setIsModalOpen(true)}
                title="Quick Add Event"
              >
                <span className="plus-icon">+</span>
                <span className="fab-text">Add Event</span>
              </button>
            </section>
          </div>
        </div>
      </main>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEvent}
        currentPoints={dashboardData.points.current}
      />
      <footer className="footer">
        <div>Terms</div>
        <div>Privacy</div>
        <div className="social">ⓕ ⓣ ⓘ</div>
      </footer>
    </div>
  )
}


