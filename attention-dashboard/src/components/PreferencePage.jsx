import React, { useState } from 'react';
import './PreferencePage.css';

export default function PreferencePage({ onComplete }) {
    const [selected, setSelected] = useState([]);

    const tiles = [
        { key: 'Academics', icon: '📚', desc: 'Classes, assignments, exams' },
        { key: 'Skill', icon: '🎯', desc: 'Workshops, certifications, projects' },
        { key: 'Networking', icon: '🤝', desc: 'Events, meetups, connections' }
    ];

    const handleClick = (key) => {
        setSelected(prev => {
            if (prev.includes(key)) return prev.filter(p => p !== key);
            if (prev.length < 3) return [...prev, key];
            return prev;
        });
    };

    const getRank = (key) => {
        const i = selected.indexOf(key);
        return i !== -1 ? ['1st', '2nd', '3rd'][i] : null;
    };

    const handleContinue = async () => {
        if (selected.length === 0) return;
        const token = localStorage.getItem('token');
        const priorities = selected.map((name, i) => ({ name, rank: i + 1 }));

        try {
            await fetch('http://localhost:5000/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
                body: JSON.stringify({ priorities })
            });
        } catch (err) {
            console.error('Failed to save preferences:', err);
        }
        onComplete();
    };

    return (
        <div className="pref-wrapper">
            <div className="pref-glow-orb orb-a"></div>
            <div className="pref-glow-orb orb-b"></div>

            <div className="pref-card glass-pref">
                <div className="pref-header">
                    <div className="pref-logo">
                        <span>★</span>
                    </div>
                    <h1 className="pref-title">Set Your Priorities</h1>
                    <p className="pref-subtitle">Click the tiles in the order of your preference</p>
                </div>

                <div className="pref-tiles">
                    {tiles.map(tile => {
                        const rank = getRank(tile.key);
                        return (
                            <button
                                key={tile.key}
                                className={`pref-tile ${rank ? 'selected' : ''}`}
                                onClick={() => handleClick(tile.key)}
                            >
                                {rank && <div className="pref-rank-badge">{rank}</div>}
                                <div className="pref-tile-icon">{tile.icon}</div>
                                <div className="pref-tile-name">{tile.key}</div>
                                <div className="pref-tile-desc">{tile.desc}</div>
                            </button>
                        );
                    })}
                </div>

                <button
                    className={`pref-continue-btn ${selected.length > 0 ? 'active' : ''}`}
                    onClick={handleContinue}
                    disabled={selected.length === 0}
                >
                    {selected.length === 0 ? 'Select at least one' : `Continue →`}
                </button>
            </div>
        </div>
    );
}
