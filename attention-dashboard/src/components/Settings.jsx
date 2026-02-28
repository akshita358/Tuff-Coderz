import React, { useState, useEffect } from 'react';
import './Settings.css';

export default function Settings({ onNavigate, onUserUpdate }) {
    const [priorities, setPriorities] = useState([]);
    const [toggles, setToggles] = useState({
        autoAdjust: false,
        emailReminders: false,
        eventAlerts: false,
        weeklySummary: false,
        twoFactor: false
    });
    const [profile, setProfile] = useState({ name: '', email: '', avatar: '' });
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/user/settings', {
            headers: { 'x-auth-token': token || '' }
        })
            .then(res => res.json())
            .then(data => {
                if (data.priorities) setPriorities(data.priorities.map(p => p.name));
                if (data.toggles) setToggles(data.toggles);
                if (data.profile) {
                    setProfile(data.profile);
                    setNewName(data.profile.name);
                }
            })
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const handlePriorityClick = (key) => {
        setPriorities(prev => {
            if (prev.includes(key)) return prev.filter(p => p !== key);
            if (prev.length < 3) return [...prev, key];
            return prev;
        });
    };

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getRankText = (index) => ['1st', '2nd', '3rd'][index] || '';

    const handleSaveChanges = async () => {
        const token = localStorage.getItem('token');
        const priorityPayload = priorities.map((name, i) => ({ name, rank: i + 1 }));
        try {
            const res = await fetch('http://localhost:5000/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
                body: JSON.stringify({ priorities: priorityPayload, toggles, name: newName })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Settings saved successfully!');
                if (data.profile) {
                    setProfile(data.profile);
                    if (onUserUpdate) onUserUpdate(data.profile);
                }
                return true;
            } else {
                alert(`Failed to save settings: ${data.error || data.msg || 'Unknown Error'}`);
                return false;
            }
        } catch (error) {
            console.error('Save failed:', error);
            alert('A network error occurred while saving.');
            return false;
        }
    };

    return (
        <div className="settings-wrapper">
            <header className="app-header glass-header">
                <div className="header-glow"></div>
                <div className="header-content">
                    <h1>Attention Seekers</h1>
                </div>
            </header>

            <main className="layout settings-layout">
                <aside className="sidebar">
                    <section className="card glass-card nav-card">
                        <h2 className="section-title">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                            Navigation
                        </h2>
                        <ul className="list nav-list">
                            <li><a className="link nav-link" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>Dashboard</a></li>
                            <li><span className="muted nav-link active">Settings</span></li>
                        </ul>
                    </section>
                </aside>

                <section className="content settings-content">
                    <div className="card glass-card actionsBar-wrapper" id="actionsBar">
                        <button id="cancelBtn" className="cta cancel-cta" onClick={() => onNavigate('dashboard')}>Cancel</button>
                        <button id="saveBtn" className="cta primary-cta glow-btn" onClick={async () => {
                            const success = await handleSaveChanges();
                            if (success) onNavigate('dashboard');
                        }}>Save Changes</button>
                    </div>

                    <section className="card glass-card">
                        <div className="card-glow"></div>
                        <h2 className="section-title text-gradient">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            General Information
                        </h2>
                        <div className="grid form-grid">
                            <div className="field profile-avatar-field" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                <div className="avatar" style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: 'radial-gradient(#8b5cf6, #6d28d9)', color: '#e0e7ff',
                                    display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '24px'
                                }}>{profile.avatar || 'U'}</div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text)' }}>{profile.name || 'User'}</h3>
                                    <div className="muted small">{profile.email}</div>
                                </div>
                            </div>
                            <div className="field input-field">
                                <label htmlFor="nameInput">Name</label>
                                <input
                                    id="nameInput"
                                    type="text"
                                    placeholder="Your name"
                                    className="glass-input"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div className="field input-field">
                                <label htmlFor="emailInput">University email</label>
                                <input id="emailInput" type="email" placeholder="you@university.edu" className="glass-input" value={profile.email} readOnly style={{ opacity: 0.7 }} />
                            </div>
                        </div>
                    </section>

                    <section className="card glass-card">
                        <div className="card-glow"></div>
                        <h2 className="section-title text-gradient">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                            </svg>
                            Attention Preferences
                        </h2>
                        <div className="grid">
                            <div className="field priority-field col-span-full">
                                <div className="priority-header">
                                    <label>Priority Order</label>
                                    <div className="priority-actions">
                                        <button className="clear-btn" onClick={() => setPriorities([])}>Clear</button>
                                        <button className="edit-btn" onClick={handleSaveChanges}>Edit</button>
                                    </div>
                                </div>
                                <p className="small muted" style={{ marginBottom: '12px' }}>Click the tags in the order of your preference (1st, 2nd, 3rd)</p>
                                <div id="priorityTags" className="tags-container">
                                    {['Academics', 'Skills', 'Culturals'].map((key) => {
                                        const index = priorities.indexOf(key);
                                        const isRanked = index !== -1;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                className="tag glass-tag"
                                                onClick={() => handlePriorityClick(key)}
                                                style={isRanked ? { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'rgba(139, 92, 246, 0.1)' } : {}}
                                            >
                                                {isRanked && <span className="priority-rank">{getRankText(index)}</span>}
                                                <span>{key}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="field col-span-full toggle-field">
                                <div className="toggle-wrapper">
                                    <div className="toggle-info">
                                        <label>Auto-adjust priorities</label>
                                        <span className="small muted">Dynamically adapt based on upcoming deadlines</span>
                                    </div>
                                    <label className="switch" htmlFor="autoAdjust">
                                        <input id="autoAdjust" type="checkbox" checked={toggles.autoAdjust} onChange={() => handleToggle('autoAdjust')} />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="status-label" style={{ color: toggles.autoAdjust ? 'var(--accent)' : 'var(--muted)' }}>{toggles.autoAdjust ? 'On' : 'Off'}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="card glass-card">
                        <div className="card-glow"></div>
                        <h2 className="section-title text-gradient">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            Notifications
                        </h2>
                        <div className="grid grid-3">
                            {[
                                { id: 'emailReminders', label: 'Email reminders' },
                                { id: 'eventAlerts', label: 'Event alerts' },
                                { id: 'weeklySummary', label: 'Weekly summary' }
                            ].map(item => (
                                <div key={item.id} className="field toggle-field vertical-toggle">
                                    <div className="toggle-wrapper">
                                        <label>{item.label}</label>
                                        <div className="switch-group">
                                            <label className="switch" htmlFor={`toggle_${item.id}`}>
                                                <input id={`toggle_${item.id}`} type="checkbox" checked={toggles[item.id]} onChange={() => handleToggle(item.id)} />
                                                <span className="slider round"></span>
                                            </label>
                                            <span className="status-label" style={{ color: toggles[item.id] ? 'var(--accent)' : 'var(--muted)' }}>{toggles[item.id] ? 'On' : 'Off'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card glass-card">
                        <div className="card-glow"></div>
                        <h2 className="section-title text-gradient">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Security
                        </h2>
                        <div className="grid grid-2 security-grid">
                            <div className="field">
                                <button id="changePasswordBtn" className="glass-btn pulse-hover">Change password</button>
                            </div>
                            <div className="field toggle-field">
                                <div className="toggle-wrapper compact">
                                    <label htmlFor="toggle_twoFactor" className="security-label">Two-factor auth</label>
                                    <label className="switch" htmlFor="toggle_twoFactor">
                                        <input id="toggle_twoFactor" type="checkbox" checked={toggles.twoFactor} onChange={() => handleToggle('twoFactor')} />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="status-label" style={{ color: toggles.twoFactor ? 'var(--accent)' : 'var(--muted)' }}>{toggles.twoFactor ? 'On' : 'Off'}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
            <div id="toast" className="glass-toast"></div>
        </div>
    );
}
