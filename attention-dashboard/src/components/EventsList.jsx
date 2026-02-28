import React from 'react'

function Row({ id, title, category, date, status, onStatusUpdate }) {
  return (
    <div className="event-row">
      <div className="event-title">
        <div className="event-title-text">{title}</div>
        <div className="event-category">{category}</div>
      </div>
      <div className="event-date">{date}</div>
      <div className="event-action">
        {status === 'Upcoming' && (
          <button
            className="status-pill upcoming clickable"
            onClick={() => onStatusUpdate(id, 'Attended')}
            title="Mark as Attended"
          >
            Complete
          </button>
        )}
        {status === 'Attended' && (
          <span className="status-pill attended">Done</span>
        )}
      </div>
    </div>
  )
}

export default function EventsList({ attended = [], upcoming = [], onStatusUpdate }) {
  return (
    <div className="events">
      <div className="events-columns">
        <div className="events-column">
          <div className="events-heading">Attended</div>
          <div className="events-list">
            {attended.length > 0 ? (
              attended.map((e, i) => (
                <Row key={i} {...e} onStatusUpdate={onStatusUpdate} />
              ))
            ) : (
              <div className="no-events-placeholder">No attended events yet</div>
            )}
          </div>
        </div>
        <div className="events-column">
          <div className="events-heading">Upcoming</div>
          <div className="events-list">
            {upcoming.length > 0 ? (
              upcoming.map((e, i) => (
                <Row key={i} {...e} onStatusUpdate={onStatusUpdate} />
              ))
            ) : (
              <div className="no-events-placeholder">No upcoming events yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
