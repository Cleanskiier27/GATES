import { useState } from 'react'
import './App.css'

const PROGRAMS = [
  { id: 'sbir-i', phase: 'Phase I', title: 'Security Payload PCB Design', agency: 'NASA', amount: '$275,000', status: 'active', progress: 72, deadline: '2026-08-15', desc: 'Develop hardware security module for CubeSat payload with ATECC608B crypto engine and STM32H743 MCU.' },
  { id: 'sbir-ii', phase: 'Phase II', title: 'Orbital Resource Security Network', agency: 'NASA', amount: '$1,500,000', status: 'pending', progress: 15, deadline: '2026-12-01', desc: 'Scale security payload to multi-node mesh network for LEO constellation protection.' },
  { id: 'sttr', phase: 'STTR', title: 'AI-Driven Anomaly Detection', agency: 'DoD', amount: '$450,000', status: 'draft', progress: 5, deadline: '2027-03-01', desc: 'Machine learning threat classification for embedded sensor arrays in contested space environments.' },
]

const MILESTONES = [
  { date: '2026-02-12', label: 'PCB Schematic v0.1 Complete', done: true },
  { date: '2026-03-28', label: 'BOM Finalized & Costed', done: true },
  { date: '2026-04-15', label: 'Flux Schematic Sync — Preciseliens', done: true },
  { date: '2026-05-01', label: '3D PCB Model & Interactive Viewer', done: true },
  { date: '2026-05-15', label: 'SBIR Phase I Proposal Draft', done: false },
  { date: '2026-06-01', label: 'Prototype PCB Fabrication Order', done: false },
  { date: '2026-07-15', label: 'Firmware Alpha — Secure Boot', done: false },
  { date: '2026-08-15', label: 'Phase I Final Report Submission', done: false },
]

const FLUX_URL = 'https://www.flux.ai/preciseliens/many-plum-matter-compiler'

function StatusBadge({ status }) {
  const colors = { active: '#6ee7b7', pending: '#fbbf24', draft: '#9ca3af' }
  return <span className="badge" style={{ '--badge-color': colors[status] || '#9ca3af' }}>{status}</span>
}

function ProgressBar({ value, color }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value}%`, background: color || 'var(--accent)' }} />
      <span className="progress-label">{value}%</span>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedProgram, setSelectedProgram] = useState(null)

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="none" stroke="url(#lg)" strokeWidth="2.5"/>
              <circle cx="16" cy="16" r="6" fill="none" stroke="#6ee7b7" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="2" fill="#6ee7b7"/>
              <line x1="16" y1="2" x2="16" y2="10" stroke="#3b82f6" strokeWidth="1"/>
              <line x1="16" y1="22" x2="16" y2="30" stroke="#3b82f6" strokeWidth="1"/>
              <line x1="2" y1="16" x2="10" y2="16" stroke="#3b82f6" strokeWidth="1"/>
              <line x1="22" y1="16" x2="30" y2="16" stroke="#3b82f6" strokeWidth="1"/>
              <defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#6ee7b7"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs>
            </svg>
          </div>
          <h1 className="topbar-title">SBIR <span className="accent">Access Funding</span></h1>
        </div>
        <nav className="topbar-nav">
          {['dashboard','programs','schematics','milestones'].map(t => (
            <button key={t} className={`nav-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
        <div className="topbar-right">
          <span className="env-badge">Preciseliens</span>
          <a href={FLUX_URL} target="_blank" rel="noopener noreferrer" className="flux-link" title="Open Flux.ai Schematic">
            Flux.ai ↗
          </a>
        </div>
      </header>

      <main className="main">
        {activeTab === 'dashboard' && (
          <section className="view fade-in">
            <div className="view-header">
              <h2>Funding Dashboard</h2>
              <p className="subtitle">NASA SBIR Ignite — Security Payload Research Portfolio</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Funding</span>
                <span className="stat-value green">$2,225,000</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Active Programs</span>
                <span className="stat-value blue">3</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">PCB Progress</span>
                <span className="stat-value amber">72%</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Next Deadline</span>
                <span className="stat-value">Aug 15</span>
              </div>
            </div>

            <div className="panel-grid">
              <div className="panel">
                <h3>Active Programs</h3>
                {PROGRAMS.map(p => (
                  <div key={p.id} className="program-row" onClick={() => { setSelectedProgram(p); setActiveTab('programs'); }}>
                    <div className="program-row-top">
                      <span className="program-phase">{p.phase}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <span className="program-title">{p.title}</span>
                    <ProgressBar value={p.progress} />
                  </div>
                ))}
              </div>

              <div className="panel">
                <h3>Quick Links</h3>
                <div className="quick-links">
                  <a href={FLUX_URL} target="_blank" rel="noopener noreferrer" className="qlink">
                    <span className="qlink-icon">⚡</span>
                    <div><strong>Flux.ai Schematic</strong><br/><small>Preciseliens PCB Design</small></div>
                  </a>
                  <a href="file:///C:/repository/sbir-ignite-pcb/index.html" className="qlink">
                    <span className="qlink-icon">🔧</span>
                    <div><strong>PCB Schematic Viewer</strong><br/><small>2D/3D Interactive View</small></div>
                  </a>
                  <a href="https://www.sbir.gov/registration" target="_blank" rel="noopener noreferrer" className="qlink">
                    <span className="qlink-icon">📋</span>
                    <div><strong>SBIR.gov Portal</strong><br/><small>Registration & Submissions</small></div>
                  </a>
                  <a href="https://techport.nasa.gov" target="_blank" rel="noopener noreferrer" className="qlink">
                    <span className="qlink-icon">🚀</span>
                    <div><strong>NASA TechPort</strong><br/><small>Technology Portfolio</small></div>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'programs' && (
          <section className="view fade-in">
            <div className="view-header">
              <h2>Funding Programs</h2>
              <p className="subtitle">Track SBIR/STTR grants and proposal status</p>
            </div>
            <div className="programs-list">
              {PROGRAMS.map(p => (
                <div key={p.id} className={`program-card ${selectedProgram?.id === p.id ? 'selected' : ''}`} onClick={() => setSelectedProgram(p)}>
                  <div className="program-card-header">
                    <div>
                      <span className="program-phase">{p.phase}</span>
                      <span className="program-agency">{p.agency}</span>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <h3>{p.title}</h3>
                  <p className="program-desc">{p.desc}</p>
                  <div className="program-meta">
                    <span className="meta-amount">{p.amount}</span>
                    <span className="meta-deadline">Due: {p.deadline}</span>
                  </div>
                  <ProgressBar value={p.progress} color={p.status === 'active' ? '#6ee7b7' : p.status === 'pending' ? '#fbbf24' : '#6b7280'} />
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'schematics' && (
          <section className="view fade-in">
            <div className="view-header">
              <h2>Schematic Resources</h2>
              <p className="subtitle">Flux.ai sync with Preciseliens PCB designs</p>
            </div>
            <div className="sch-grid">
              <div className="sch-card primary">
                <h3>🔗 Flux.ai — Live Schematic</h3>
                <p>Preciseliens PCB project synced from Flux.ai. Click to open the live collaborative editor.</p>
                <a href={FLUX_URL} target="_blank" rel="noopener noreferrer" className="sch-btn">Open in Flux.ai ↗</a>
                <div className="sch-meta">
                  <span>Project: many-plum-matter-compiler</span>
                  <span>Last sync: May 1, 2026</span>
                </div>
              </div>
              <div className="sch-card">
                <h3>🖥️ Local PCB Viewer</h3>
                <p>Interactive 2D schematics, 3D board model, BOM, and netlist viewer.</p>
                <a href="file:///C:/repository/sbir-ignite-pcb/index.html" className="sch-btn">Open Viewer</a>
                <div className="sch-meta">
                  <span>Rev 0.1 · 5 files</span>
                  <span>Block Diagram · 3D View</span>
                </div>
              </div>
              <div className="sch-card">
                <h3>📦 Preciseliens Backup</h3>
                <p>Local backup of schematic data, styles, and deployment configuration.</p>
                <div className="sch-meta">
                  <span>backup_preciseliens/</span>
                  <span>README · script.js · style.css</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'milestones' && (
          <section className="view fade-in">
            <div className="view-header">
              <h2>Program Milestones</h2>
              <p className="subtitle">SBIR Phase I timeline and deliverables</p>
            </div>
            <div className="timeline">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`tl-item ${m.done ? 'done' : ''}`}>
                  <div className="tl-dot" />
                  <div className="tl-content">
                    <span className="tl-date">{m.date}</span>
                    <span className="tl-label">{m.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
