import React from 'react'

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-title">{title}</div>
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
      </div>
      {icon && <div className="stat-card-icon">{icon}</div>}
    </div>
  )
}
