import React from 'react'

export default function ProgressDonut({ percent = 0, label, sublabel }) {
  const radius = 54
  const stroke = 10
  const normalizedRadius = radius - stroke
  const circumference = normalizedRadius * 2 * Math.PI
  const dashOffset = circumference - (percent / 100) * circumference
  return (
    <div className="donut">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#2f3743"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#f5a524"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: dashOffset, transition: 'stroke-dashoffset 0.5s ease' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="donut-text">
          {Math.round(percent)}%
        </text>
      </svg>
      <div className="donut-labels">
        <div className="donut-title">{label}</div>
        {sublabel && <div className="donut-subtitle">{sublabel}</div>}
      </div>
    </div>
  )
}
