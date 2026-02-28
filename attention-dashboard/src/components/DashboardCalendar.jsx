import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DashboardCalendar.css';

export default function DashboardCalendar({ events }) {
    // Extract all unique dates from events
    const eventDates = events.map(e => {
        // Basic parser for "DD Mon" format or other variants
        const match = e.date.match(/(\d+)\s+([A-Z][a-z]+)/i);
        if (match) {
            const day = parseInt(match[1]);
            const monthStr = match[2];
            const month = new Date(`${monthStr} 1, 2026`).getMonth();
            return new Date(2026, month, day).toDateString();
        }
        return null;
    }).filter(d => d !== null);

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (eventDates.find(d => d === date.toDateString())) {
                return 'highlight-event';
            }
        }
        return null;
    };

    return (
        <div className="calendar-container glass-card">
            <Calendar
                tileClassName={tileClassName}
                className="custom-calendar"
                view="month"
            />
        </div>
    );
}
