import React, { useState, useEffect } from 'react';
import './AddEventModal.css';

export default function AddEventModal({ isOpen, onClose, onAdd, currentPoints }) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('Wellness');
    const [status, setStatus] = useState('Upcoming');
    const [priorities, setPriorities] = useState({});

    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('token');
            fetch('http://localhost:5000/api/user/settings', {
                headers: { 'x-auth-token': token || '' }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.priorities) {
                        const pMap = {};
                        data.priorities.forEach(p => {
                            pMap[p.name.toLowerCase()] = p.rank;
                        });
                        setPriorities(pMap);
                    }
                })
                .catch(err => console.error('Error fetching priorities:', err));
        }
    }, [isOpen]);

    const getCost = (cat) => {
        const rank = priorities[cat.toLowerCase()];
        if (rank === 1) return 5;
        if (rank === 2) return 10;
        if (rank === 3) return 20;
        return 10;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cost = getCost(category);
        if (currentPoints < cost) {
            alert('Insufficient points!');
            return;
        }
        onAdd({ title, date, category, status, cost });
        setTitle('');
        setDate('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-card">
                <div className="modal-header">
                    <h2>Quick Add Event ✨</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Event Name</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Morning Walk"
                            required
                            className="glass-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="e.g. 27 Sep"
                            required
                            className="glass-input"
                        />
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
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
                        <div className="form-group">
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
                    </div>
                    <div className="cost-preview">
                        Cost: <span className="cost-val">{getCost(category)} pts</span>
                    </div>
                    <button type="submit" className="save-btn primary-cta">Add to Schedule</button>
                </form>
            </div>
        </div>
    );
}
