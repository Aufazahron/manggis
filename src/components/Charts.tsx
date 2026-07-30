import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { gradeShares, productionWeek } from '../data'

const tooltipStyle = {
  background: '#13241C',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: '#EEF5F0',
  fontSize: 14,
}

export function ProductionChart() {
  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <div>
          <h2>Tren Produksi 7 Hari</h2>
          <p>Kilogram hasil panen vs target harian</p>
        </div>
        <div className="legend">
          <span className="legend-item"><i className="swatch swatch-a" /> Aktual</span>
          <span className="legend-item"><i className="swatch swatch-b" /> Target</span>
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productionWeek} barGap={6} barCategoryGap="28%">
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#8AA396', fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8AA396', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="target" fill="#2A4A3A" radius={[6, 6, 0, 0]} />
            <Bar dataKey="kg" fill="#3D9B6E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export function GradeChart() {
  return (
    <section className="panel grade-panel">
      <div className="panel-head">
        <div>
          <h2>Distribusi Grade</h2>
          <p>Komposisi stok hasil QC</p>
        </div>
      </div>
      <div className="grade-body">
        <div className="grade-chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gradeShares}
                dataKey="persen"
                nameKey="grade"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={3}
                stroke="none"
              >
                {gradeShares.map((g) => (
                  <Cell key={g.grade} fill={g.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grade-center">
            <strong>68%</strong>
            <span>Grade A</span>
          </div>
        </div>
        <ul className="grade-list">
          {gradeShares.map((g) => (
            <li key={g.grade}>
              <span className="grade-dot" style={{ background: g.color }} />
              <div>
                <strong>Grade {g.grade}</strong>
                <em>{g.kg.toLocaleString('id-ID')} kg</em>
              </div>
              <b>{g.persen}%</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
