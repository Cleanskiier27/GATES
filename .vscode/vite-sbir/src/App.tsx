import { useState, useEffect } from 'react';
import SchematicViewer from './components/SchematicViewer';
import YieldMap from './components/YieldMap';
import { Cpu, Activity, ShieldAlert, Zap, AlertTriangle, Newspaper } from 'lucide-react';

function App() {
  const [isDeauthing, setIsDeauthing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ONLINE - SECURE');
  const [bom, setBom] = useState([]);
  const [telemetry, setTelemetry] = useState({
    core_temp: 42.8,
    preciseliens_model: "ACTIVE",
    netlist_routes: 1402
  });

  const handleDeauth = () => {
    setIsDeauthing(true);
    setSystemStatus('DEAUTH IN PROGRESS...');
    
    fetch('http://localhost:4432/api/deauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partition_id: 'secure-0x1a' })
    }).catch(err => console.error(err));

    setTimeout(() => {
      setSystemStatus('PARTITION DEAUTHED');
      setTimeout(() => {
         setIsDeauthing(false);
         setSystemStatus('ONLINE - SECURE');
      }, 5000);
    }, 3000);
  };
  const [activeTab, setActiveTab] = useState('schematic');
  const [loading, setLoading] = useState(true);
  const [isBomOpen, setIsBomOpen] = useState(false);
  const [diagnosticsActive, setDiagnosticsActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const runDiagnostics = () => {
    setDiagnosticsActive(true);
    setTimeout(() => setDiagnosticsActive(false), 3000);
  };

  const syncNetworkBuster = () => {
    setIsSyncing(true);
    // Simulate a build and git push sync to networkbuster.net.git
    fetch('http://localhost:4432/api/sync', { method: 'POST' }).catch(() => {});
    setTimeout(() => {
      setIsSyncing(false);
      setSystemStatus('SYNCED TO NETWORKBUSTER.NET.GIT');
    }, 4000);
  };

  useEffect(() => {
    // Initial fetches
    fetch('http://localhost:4432/api/bom')
      .then(res => res.json())
      .then(data => setBom(data.components))
      .catch(err => console.error("Failed to fetch BOM", err));

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Polling Telemetry
    const interval = setInterval(() => {
      fetch('http://localhost:4432/api/telemetry')
        .then(res => res.json())
        .then(data => {
            if (!isDeauthing) {
                setSystemStatus(data.status);
            }
            setTelemetry({
              core_temp: data.core_temp,
              preciseliens_model: data.preciseliens_model,
              netlist_routes: data.netlist_routes
            });
        })
        .catch(err => console.error("Telemetry failed", err));
    }, 2000);
    return () => clearInterval(interval);
  }, [isDeauthing]);

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <h2>INITIALIZING SBIR PAYLOAD...</h2>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h1>NASA SBIR Ignite</h1>
        <nav>
          <div className={`menu-item ${activeTab === 'schematic' ? 'active' : ''}`} onClick={() => setActiveTab('schematic')}>
            <Cpu size={20} />
            <span>Payload Schematic</span>
          </div>
          <div className={`menu-item ${activeTab === 'telemetry' ? 'active' : ''}`} onClick={() => setActiveTab('telemetry')}>
            <Activity size={20} />
            <span>Telemetry</span>
          </div>
          <div className={`menu-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <ShieldAlert size={20} />
            <span>Security Partition</span>
          </div>
          <div className={`menu-item ${activeTab === 'yield' ? 'active' : ''}`} onClick={() => setActiveTab('yield')}>
            <Zap size={20} />
            <span>Preciseliens Yield</span>
          </div>
          <div className={`menu-item ${activeTab === 'press' ? 'active' : ''}`} onClick={() => setActiveTab('press')}>
            <Newspaper size={20} />
            <span>Press Release</span>
          </div>
        </nav>
        
        <div className="glass-panel" style={{ marginTop: 'auto', borderColor: isDeauthing ? 'rgba(255, 50, 50, 0.5)' : 'var(--border-glass)' }}>
          <div className="stat-label">System Status</div>
          <div className="stat-value" style={{ 
            color: isDeauthing ? '#ff3333' : 'var(--accent-primary)', 
            fontSize: '1rem', 
            marginTop: '0.5rem'
          }}>
            {systemStatus}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'schematic' && (
          <>
            <SchematicViewer isDeauthing={isDeauthing} components={bom} />
            
            {/* UI Overlays */}
            <div className="ui-overlay">
              <div className="glass-panel mb-4">
                <div className="stat-item">
                  <div className="stat-label">Core Temp</div>
                  <div className="stat-value">{telemetry.core_temp} °C</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Preciseliens Model</div>
                  <div className="stat-value">{telemetry.preciseliens_model}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Netlist Routes</div>
                  <div className="stat-value">{telemetry.netlist_routes}</div>
                </div>
              </div>

              {/* BOM Overlay inside Schematic View */}
              <div className="glass-panel bom-inline-panel">
                 <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                    <Cpu size={16} className="text-[#00f0ff]" />
                    <h3 className="text-sm font-bold text-[#00f0ff] uppercase tracking-wider">Live BOM</h3>
                 </div>
                 <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2">
                    {bom.map(item => (
                       <div key={item.id} className="flex flex-col bg-white/5 p-2 rounded border border-white/5">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-bold text-white">{item.id} - {item.type}</span>
                             <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                                backgroundColor: item.status === 'secure' ? 'rgba(112,0,255,0.2)' : 'rgba(0,240,255,0.2)',
                                color: item.status === 'secure' ? '#7000ff' : '#00f0ff'
                             }}>
                                {item.status}
                             </span>
                          </div>
                          <span className="text-[10px] text-muted font-mono">{item.part_number}</span>
                       </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="controls">
              <button className="btn" onClick={runDiagnostics}>
                 {diagnosticsActive ? 'RUNNING...' : 'Run Diagnostics'}
              </button>
              <button className="btn" onClick={() => setIsBomOpen(true)}>View BOM</button>
              <button className="btn" onClick={syncNetworkBuster} style={{
                backgroundColor: isSyncing ? 'rgba(0,240,255,0.2)' : 'transparent'
              }}>
                 {isSyncing ? 'SYNCING TO NETWORKBUSTER.NET.GIT...' : 'Sync networkbuster.net.git'}
              </button>
              <button className="btn" onClick={handleDeauth} style={{
                borderColor: isDeauthing ? '#ff3333' : '',
                color: isDeauthing ? '#ff3333' : ''
              }}>
                {isDeauthing ? <><AlertTriangle size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> DEAUTHING</> : 'Deauth Partition'}
              </button>
            </div>

            {isBomOpen && (
              <div className="modal-overlay" onClick={() => setIsBomOpen(false)}>
                <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Bill of Materials</h2>
                    <button className="text-muted hover:text-white" onClick={() => setIsBomOpen(false)}>✕</button>
                  </div>
                  <table className="bom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Part Number</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bom.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.type}</td>
                          <td>{item.part_number}</td>
                          <td style={{ color: item.status === 'secure' ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}>
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'telemetry' && (
          <div className="tab-view">
             <div className="glass-panel w-full h-full overflow-auto">
                <h2 className="tab-title">Live System Telemetry</h2>
                <div className="telemetry-grid">
                   <div className="telemetry-card">
                      <span className="label">Core CPU Frequency</span>
                      <span className="value">4.2 GHz</span>
                   </div>
                   <div className="telemetry-card">
                      <span className="label">Memory Usage</span>
                      <span className="value">1.4 GB / 4.0 GB</span>
                   </div>
                   <div className="telemetry-card">
                      <span className="label">Link Quality</span>
                      <span className="value" style={{color: '#00ff00'}}>98%</span>
                   </div>
                   <div className="telemetry-card">
                      <span className="label">Encryption Status</span>
                      <span className="value">AES-256-GCM</span>
                   </div>
                </div>
                {/* Placeholder for charts */}
                <div className="chart-placeholder mt-8 h-64 flex items-center justify-center border border-dashed border-white/20 rounded">
                   <p className="text-muted">Real-time Data Stream: Connected to Port 4432</p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="tab-view">
             <div className="glass-panel w-full h-full overflow-auto">
                <h2 className="tab-title">Security Partition Controls</h2>
                <div className="security-log mb-6">
                   <div className="log-entry">[09:22:10] SYSTEM BOOT SUCCESSFUL</div>
                   <div className={`log-entry ${isDeauthing ? 'text-alert' : ''}`}>[09:45:02] PARTITION secure-0x1a MONITORING ACTIVE</div>
                   {isDeauthing && <div className="log-entry text-alert blink">[10:12:45] INITIATING EXTERNAL DEAUTH SEQUENCE...</div>}
                </div>
                <div className="partition-card p-6 border border-white/10 rounded-lg bg-black/20">
                   <div className="flex justify-between items-center">
                      <div>
                         <h3 className="text-xl font-bold mb-1">Partition: secure-0x1a</h3>
                         <p className="text-sm text-muted">Active Shielding: GATES Protocol V3</p>
                      </div>
                      <button className="btn" onClick={handleDeauth}>
                         {isDeauthing ? 'DEAUTHING...' : 'Force Deauth'}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'yield' && (
          <div className="tab-view">
             <div className="glass-panel w-full h-full overflow-auto">
                <h2 className="tab-title">Preciseliens Yield Analysis</h2>
                <div className="yield-stats flex gap-8 mb-8">
                   <div className="yield-stat-item">
                      <div className="label">Current Yield</div>
                      <div className="value text-4xl">94.8%</div>
                   </div>
                   <div className="yield-stat-item">
                      <div className="label">Target Yield</div>
                      <div className="value text-4xl text-muted">95.0%</div>
                   </div>
                </div>
                <div className="yield-map flex-1 min-h-[400px] w-full bg-black/40 border border-white/10 rounded flex items-center justify-center overflow-hidden p-2">
                   <YieldMap />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'press' && (
          <div className="tab-view">
             <div className="glass-panel w-full h-full overflow-auto">
                <h2 className="tab-title flex items-center gap-2">
                  <Newspaper className="text-white" size={24} style={{ color: 'var(--accent-primary)' }} />
                  Official Press Release
                </h2>
                <div className="press-release-content p-8 border border-white/10 rounded-lg bg-black/40 mt-6 max-w-4xl mx-auto" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                   <h1 className="text-3xl font-bold text-white mb-4 tracking-tight" style={{ color: 'var(--accent-primary)' }}>
                      NetworkBuster Announces Next-Generation SBIR Ignite Payload Systems
                   </h1>
                   <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-8 border-b border-white/10 pb-4">
                      <span className="font-mono bg-white/10 px-2 py-1 rounded text-white">FOR IMMEDIATE RELEASE</span>
                      <span>|</span>
                      <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>|</span>
                      <span style={{ color: 'var(--accent-primary)' }} className="font-bold tracking-wider">NETWORKBUSTER AEROSPACE</span>
                   </div>
                   
                   <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                      <p>
                         <strong className="text-white">HOUSTON, TX</strong> — NetworkBuster today announced significant advancements in their ongoing NASA SBIR Ignite project. The latest system deployment features an interactive 3D PCB schematic viewer equipped with real-time telemetry, precision yield mapping capabilities, and aerospace-grade security partitions.
                      </p>
                      <p>
                         "This deployment marks a new era in secure, real-time payload visualization," stated the lead engineering team at NetworkBuster. "By integrating advanced diagnostic controls with immediate network synchronization, we are setting a new standard for high-fidelity aerospace telemetry systems."
                      </p>
                      <p>
                         The newly launched <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>Preciseliens</span> framework provides seamless integration with existing network infrastructure. Key features of the new release include state-of-the-art automated security partition management, real-time hardware telemetry streams, and dynamic live BOM tracking—all accessible through a unified, high-performance interface.
                      </p>
                      <p>
                         The application is currently synchronized with the NetworkBuster master branch and is entering active deployment testing for the next phase of the SBIR Ignite program.
                      </p>
                   </div>
                   
                   <div className="mt-12 pt-6 border-t border-white/10 text-sm text-muted">
                      <p className="mb-2 font-bold text-white text-base">About NetworkBuster</p>
                      <p className="mb-4 leading-relaxed">NetworkBuster is a leading provider of advanced network defense, aerospace telemetry, and highly secure visualization systems.</p>
                      <div className="font-mono text-xs p-3 bg-black/50 rounded border border-white/5 inline-block">
                         Media Inquiries: press@networkbuster.net <br/>
                         Website: www.networkbuster.net
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
