import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DashboardCalendar.css';

export default function DashboardCalendar({ events }) {
    // Map of date strings to their highest priority status
    const dateStatusMap = {};
    events.forEach(e => {
        // More robust parsing: matches "27 Sep", "Sep 27", "27th September", etc.
        const dayMatch = e.date.match(/(\d+)/);
        const monthMatch = e.date.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/i);

        if (dayMatch && monthMatch) {
            const day = parseInt(dayMatch[1]);
            const monthStr = monthMatch[1];
            // Use current year (2026 for this app context)
            const dateObj = new Date(`${monthStr} ${day}, 2026`);

            if (!isNaN(dateObj.getTime())) {
                const dateStr = dateObj.toDateString();
                // "Upcoming" takes precedence for highlighting
                if (!dateStatusMap[dateStr] || e.status === 'Upcoming') {
                    dateStatusMap[dateStr] = e.status;
                }
            }
        }
    });

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const status = dateStatusMap[date.toDateString()];
            if (status === 'Upcoming') return 'highlight-upcoming';
            if (status === 'Attended') return 'highlight-attended';
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
