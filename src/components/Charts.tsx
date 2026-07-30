import { Globe, Package } from 'lucide-react'
import { useState } from 'react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  formatPrice,
  formatYAxis,
  gradeDistribution,
  gradeLabel,
  GRADE_LINES,
  isGradeFocused,
  trendData,
  type GradeId,
} from '../data'

type ChartTooltipProps = {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    color?: string
  }>
  label?: string
}

function TrendTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">Bulan {label}</p>
      <ul>
        {payload.map((entry) => (
          <li key={entry.name}>
            <span>
              <i style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <strong>{formatPrice(Number(entry.value))}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PriceTrendChart({
  focusedGrade,
  onGradeFocus,
}: {
  focusedGrade: GradeId | null
  onGradeFocus: (gradeId: GradeId) => void
}) {
  return (
    <>
      <div className="section-head">
        <div className="section-head-row">
          <Globe className="section-icon" strokeWidth={2} />
          <h2>Trend Harga</h2>
        </div>
        <p>
          {focusedGrade
            ? `6 Bulan Terakhir, fokus ${gradeLabel(focusedGrade)}`
            : '6 Bulan Terakhir'}
        </p>
      </div>

      <div className="trend-legend">
        {GRADE_LINES.map((line) => {
          const active = isGradeFocused(line.id, focusedGrade)
          return (
            <button
              key={line.id}
              type="button"
              onClick={() => onGradeFocus(line.id)}
              className={`legend-chip ${focusedGrade === line.id ? 'focused' : ''} ${
                focusedGrade && focusedGrade !== line.id ? 'dimmed' : ''
              }`}
            >
              <i style={{ background: line.color, opacity: active ? 1 : 0.35 }} />
              <span className={active ? 'on' : 'off'}>{line.name}</span>
            </button>
          )
        })}
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={formatYAxis}
              width={36}
            />
            <Tooltip
              content={<TrendTooltip />}
              cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            {GRADE_LINES.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={focusedGrade === line.id ? 3.5 : focusedGrade ? 1.5 : 2.5}
                strokeOpacity={isGradeFocused(line.id, focusedGrade) ? 1 : 0.15}
                dot={{
                  r: isGradeFocused(line.id, focusedGrade) ? 4 : 2,
                  fill: line.color,
                  fillOpacity: isGradeFocused(line.id, focusedGrade) ? 1 : 0.15,
                  strokeWidth: 0,
                }}
                activeDot={
                  isGradeFocused(line.id, focusedGrade)
                    ? { r: 6, fill: line.color, stroke: '#fff', strokeWidth: 2 }
                    : false
                }
                hide={focusedGrade !== null && focusedGrade !== line.id}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export function GradeChart({
  focusedGrade,
  onGradeFocus,
}: {
  focusedGrade: GradeId | null
  onGradeFocus: (gradeId: GradeId) => void
}) {
  const [hoverIndex, setHoverIndex] = useState<number | undefined>(undefined)
  const focusedIndex =
    focusedGrade !== null
      ? gradeDistribution.findIndex((item) => item.gradeId === focusedGrade)
      : undefined
  const activeIndex = hoverIndex ?? focusedIndex

  return (
    <>
      <div className="section-head">
        <div className="section-head-row">
          <Package className="section-icon" strokeWidth={2} />
          <h2>Distribusi Kategori</h2>
        </div>
      </div>

      <div className="grade-body">
        <div className="grade-chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gradeDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={66}
                paddingAngle={2}
                strokeWidth={0}
                onMouseEnter={(_, index) => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(undefined)}
                onClick={(_, index) => onGradeFocus(gradeDistribution[index].gradeId)}
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke={activeIndex === index ? '#fff' : undefined}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    opacity={
                      focusedGrade === null || entry.gradeId === focusedGrade
                        ? activeIndex === undefined || activeIndex === index
                          ? 1
                          : 0.45
                        : 0.25
                    }
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grade-center" aria-hidden>
            <span>🥭</span>
          </div>
        </div>

        <ul className="grade-list">
          {gradeDistribution.map((item, index) => {
            const isFocused = isGradeFocused(item.gradeId, focusedGrade)
            return (
              <li key={item.name}>
                <button
                  type="button"
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(undefined)}
                  onClick={() => onGradeFocus(item.gradeId)}
                  className={`grade-item ${activeIndex === index ? 'active' : ''} ${
                    isFocused ? '' : 'dimmed'
                  }`}
                >
                  <span className="grade-item-row">
                    <i style={{ backgroundColor: item.color }} />
                    <em>{item.name}</em>
                    <strong>{item.value}%</strong>
                  </span>
                  {activeIndex === index ? (
                    <span className="grade-item-hint">{item.value}% dari total stok</span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
