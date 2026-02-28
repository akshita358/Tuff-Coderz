import React, { useState } from 'react';
import './WeeklyEventsPage.css';

export default function WeeklyEventsPage({ onComplete }) {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Wellness');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('Upcoming');
    const [priorities, setPriorities] = useState({});
    const [points, setPoints] = useState(100);

    React.useEffect(() => {
        const fetchPriorities = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:5000/api/user/settings', {
                    headers: { 'x-auth-token': token || '' }
                });
                const data = await res.json();
                if (data.priorities) {
                    const pMap = {};
                    data.priorities.forEach(p => {
                        pMap[p.name.toLowerCase()] = p.rank;
                    });
                    setPriorities(pMap);
                }
            } catch (err) {
                console.error('Failed to fetch priorities:', err);
            }
        };
        fetchPriorities();
    }, []);

    const getEventCost = (cat) => {
        const rank = priorities[cat.toLowerCase()];
        if (rank === 1) return 5;
        if (rank === 2) return 10;
        if (rank === 3) return 20;
        return 10; // Default
    };

    const addEvent = () => {
        if (!title || !date) return;
        const cost = getEventCost(category);
        if (points < cost) {
            alert("Not enough points for this event!");
            return;
        }
        setEvents([...events, { title, category, date, status, cost }]);
        setPoints(points - cost);
        setTitle('');
        setDate('');
    };

    const removeEvent = (index) => {
        const eventToRemove = events[index];
        setPoints(points + (eventToRemove.cost || 0));
        setEvents(events.filter((_, i) => i !== index));
    };

    const handleFinish = async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch('http://localhost:5000/api/user/events/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({ events })
            });
            onComplete();
        } catch (err) {
            console.error('Error saving events:', err);
        }
    };

    return (
        <div className="events-onboarding-wrapper">
            <div className="events-glow orb-x"></div>
            <div className="events-glow orb-y"></div>

            <div className="events-card glass-card">
                <div className="events-header">
                    <h1 className="events-title">Weekly Planning ✨</h1>
                    <p className="events-subtitle">Plan your week. Every event counts!</p>
                    <div className="onboarding-points-badge glass-card">
                        <span className="points-label">Points: </span>
                        <span className="points-value">{points} pts</span>
                    </div>
                </div>

                <div className="event-input-group status-aware-inputs">
                    <div className="input-field">
                        <label>Event Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Yoga Session"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="glass-input"
                        />
                    </div>
                    <div className="input-field">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="glass-input"
                        >
                            <option>Wellness</option>
                            <option>Academic</option>
                            <option>Sport</option>
                            <option>Social</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="input-field">
                        <label>Date</label>
                        <input
                            type="text"
                            placeholder="e.g. 27 Sep"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="glass-input"
                        />
                    </div>
                    <div className="input-field">
                        <label>Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="glass-input"
                        >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Attended">Attended</option>
                        </select>
                    </div>
                    <button className="add-event-btn primary-cta" onClick={addEvent}>Add Event</button>
                </div>

                <div className="events-list-onboarding">
                    {events.map((event, index) => (
                        <div key={index} className="event-item-preview glass-card">
                            <div className="event-info">
                                <div className="event-name">
                                    {event.title}
                                    <span className={`status-pill ${event.status.toLowerCase()}`}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="event-meta">{event.category} • {event.date} • <span className="cost-tag">-{event.cost} pts</span></div>
                            </div>
                            <button className="remove-event-btn" onClick={() => removeEvent(index)}>✕</button>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="no-events-msg">No events added yet. Start planning!</div>
                    )}
                </div>

                <button
                    className="finish-onboarding-btn"
                    onClick={handleFinish}
                    disabled={events.length === 0}
                >
                    {events.length === 0 ? 'Add at least one event' : 'Finish & Go to Dashboard →'}
                </button>
            </div>
        </div>
    );
}
