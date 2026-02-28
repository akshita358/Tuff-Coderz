import React from 'react'

function Row({ title, category, date, status, action }) {
  return (
    <div className="event-row">
      <div className="event-title">
        <div className="event-title-text">{title}</div>
        <div className="event-category">{category}</div>
      </div>
      <div className="event-date">{date}</div>
      <div className="event-action">{action}</div>
    </div>
  )
}

export default function EventsList({ attended = [], upcoming = [] }) {
  return (
    <div className="events">
      <div className="events-columns">
        <div className="events-column">
          <div className="events-heading">Attended</div>
          <div className="events-list">
            {attended.map((e, i) => (
              <Row key={i} {...e} />
            ))}
          </div>
        </div>
        <div className="events-column">
          <div className="events-heading">Upcoming</div>
          <div className="events-list">
            {upcoming.map((e, i) => (
              <Row key={i} {...e} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
