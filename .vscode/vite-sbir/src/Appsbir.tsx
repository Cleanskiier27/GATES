import { useState, useEffect } from 'react';
import SchematicViewer from './components/SchematicViewer';
import YieldMap from './components/YieldMap';
import { Cpu, Activity, ShieldAlert, Zap, AlertTriangle, Newspaper, Trash2, FolderTree, Network } from 'lucide-react';

function App() {
  const [isDeauthing, setIsDeauthing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ONLINE - SECURE');
  const [bom, setBom] = useState([]);
  const [telemetry, setTelemetry] = useState({
    core_temp: 42.8,
    preciseliens_model: "ACTIVE",
    netlist_routes: 1402,
    freq_agents: 18,
    node_aug_agents: 12,
    glyphs_recognized: 0
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
  const [shaInput, setShaInput] = useState('');
  const [shaResult, setShaResult] = useState('');
  const [latticeData, setLatticeData] = useState({ GlyphProfiling: [], LatticeFolders: [] });

  const detectShaBits = (hash: string) => {
    const cleanHash = hash.trim().replace(/^0x/i, '');
    if (!cleanHash) {
       setShaResult('');
       return;
    }
    if (!/^[a-f0-9]+$/i.test(cleanHash)) {
       setShaResult('INVALID HEX STRING');
       return;
    }
    const hexLen = cleanHash.length;
    const bits = hexLen * 4;
    let algo = 'UNKNOWN ALGORITHM';
    if (bits === 128) algo = 'MD5 / SHA-1 (Truncated)';
    else if (bits === 160) algo = 'SHA-1';
    else if (bits === 224) algo = 'SHA-224';
    else if (bits === 256) algo = 'SHA-256';
    else if (bits === 384) algo = 'SHA-384';
    else if (bits === 512) algo = 'SHA-512';
    
    setShaResult(`${bits} BITS (${algo})`);
  };

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

    fetch('http://localhost:4432/api/lattice')
      .then(res => res.json())
      .then(data => setLatticeData(data))
      .catch(err => console.error("Failed to fetch lattice data", err));

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
              netlist_routes: data.netlist_routes,
              freq_agents: data.freq_agents,
              node_aug_agents: data.node_aug_agents,
              glyphs_recognized: data.glyphs_recognized || Math.floor(Math.random() * 100)
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
          <div className={`menu-item ${activeTab === 'recycle' ? 'active' : ''}`} onClick={() => setActiveTab('recycle')}>
            <Trash2 size={20} />
            <span>Recycle Bin</span>
          </div>
          <div className={`menu-item ${activeTab === 'lattice' ? 'active' : ''}`} onClick={() => setActiveTab('lattice')}>
            <Network size={20} />
            <span>Lattice Explorer</span>
          </div>
          <div className={`menu-item ${activeTab === 'press' ? 'active' : ''}`} onClick={() => setActiveTab('press')}>
            <Newspaper size={20} />
            <span>Press Release</span>
          </div>
          <div className={`menu-item ${activeTab === 'recycle' ? 'active' : ''}`} onClick={() => setActiveTab('recycle')}>
            <Trash2 size={20} />
            <span>Recycle Bin</span>
          </div>
          <div className={`menu-item ${activeTab === 'lattice' ? 'active' : ''}`} onClick={() => setActiveTab('lattice')}>
            <Network size={20} />
            <span>Lattice Explorer</span>
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
                       <span className="label">Frequency Agents</span>
                       <span className="value" style={{ color: 'var(--accent-primary)' }}>{telemetry.freq_agents}</span>
                    </div>
                    <div className="telemetry-card">
                       <span className="label">Node Augmentation</span>
                       <span className="value" style={{ color: '#7000ff' }}>{telemetry.node_aug_agents}</span>
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

                 <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                       <ShieldAlert size={20} className="text-[#00f0ff]" />
                       Recycle Bin: Glyph Recognition Profile
                    </h3>
                    <div className="glass-panel p-6 bg-black/40 border-white/5">
                       <div className="flex justify-between items-end mb-6">
                          <div>
                             <div className="text-sm text-muted mb-1">Total Glyphs Profiled</div>
                             <div className="text-4xl font-bold text-white">{telemetry.glyphs_recognized}</div>
                          </div>
                          <div className="text-right">
                             <div className="text-xs text-muted mb-1">Recognition Engine</div>
                             <div className="text-sm font-mono text-[#00f0ff]">LUNA-RECYCLE-V4</div>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs text-muted">
                                   <span>Geometric Pattern Match</span>
                                   <span>88%</span>
                                </div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-[#00f0ff]" style={{ width: '88%' }}></div>
                                </div>
                             </div>
                             <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs text-muted">
                                   <span>Neural Glyph Indexing</span>
                                   <span>94%</span>
                                </div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-[#7000ff]" style={{ width: '94%' }}></div>
                                </div>
                             </div>
                          </div>
                          <div className="p-4 bg-black/20 border border-white/5 rounded text-[10px] font-mono text-muted overflow-hidden h-24">
                             <div className="text-[#00f0ff] mb-1">Active Glyph Streams:</div>
                             <div>0xFB1: Recognized [Circle] - Conf: 0.99</div>
                             <div>0xFB2: Recognized [Vector-Alpha] - Conf: 0.96</div>
                             <div>0xFB3: Recognized [Hex-Node] - Conf: 0.91</div>
                             <div className="animate-pulse">0xFB4: Scanning...</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Placeholder for charts */}
                 <div className="chart-placeholder mt-8 h-32 flex items-center justify-center border border-dashed border-white/20 rounded">
                    <p className="text-muted">Real-time Data Stream: Connected to Port 4432</p>
                 </div>

                {/* Agent Allocation Matrix */}
                <div className="agent-operations mt-8 p-6 border border-white/10 rounded-lg bg-black/20">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Cpu className="text-[#00f0ff]" size={20} />
                        Agent Allocation Matrix
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded border border-white/5 hover:border-[#00f0ff]/50 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold uppercase tracking-wider">Frequency Module</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-bold">ASSIGNED</span>
                            </div>
                            <p className="text-[10px] text-muted mb-3">Agent 0xFC-A assigned to spectral frequency monitoring and pixel-region synchronization.</p>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#00f0ff] w-3/4"></div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded border border-white/5 hover:border-[#7000ff]/50 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold uppercase tracking-wider">Node Augmentation</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7000ff]/20 text-[#7000ff] font-bold">SYNCING</span>
                            </div>
                            <p className="text-[10px] text-muted mb-3">Agent 0xNA-B deploying augmentation protocols to node clusters for enhanced SBIR throughput.</p>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#7000ff] w-1/2 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
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
                <div className="partition-card p-6 border border-white/10 rounded-lg bg-black/20 mb-6">
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

                {/* SHA Bit Detection Analyzer */}
                <div className="partition-card p-6 border border-white/10 rounded-lg bg-black/20 mt-6">
                   <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <ShieldAlert className="text-[#00f0ff]" size={20} />
                     SHA Bit Detection Analyzer
                   </h3>
                   <div className="flex flex-col gap-3">
                     <input 
                       type="text" 
                       value={shaInput}
                       onChange={(e) => setShaInput(e.target.value)}
                       placeholder="Enter hash string (e.g. e3b0c442...)" 
                       className="p-3 bg-black/40 border border-white/20 rounded text-white font-mono text-sm focus:border-[#00f0ff] outline-none transition-colors w-full"
                     />
                     <div className="flex justify-between items-center mt-2 p-3 bg-white/5 rounded border border-white/5">
                        <span className="text-sm text-muted">Detected Architecture:</span>
                        <span className="font-bold text-white tracking-wider" style={{ color: shaInput ? 'var(--accent-primary)' : 'inherit' }}>
                           {shaInput ? (() => {
                              const cleanHash = shaInput.trim().toLowerCase();
                              if (!/^[0-9a-f]+$/.test(cleanHash)) return "INVALID HEX STRING";
                              const bitLength = cleanHash.length * 4;
                              switch(bitLength) {
                                case 160: return "SHA-1 (160-BIT)";
                                case 224: return "SHA-224 (224-BIT)";
                                case 256: return "SHA-256 (256-BIT)";
                                case 384: return "SHA-384 (384-BIT)";
                                case 512: return "SHA-512 (512-BIT)";
                                default: return `UNKNOWN (${bitLength}-BIT)`;
                              }
                           })() : "AWAITING INPUT"}
                        </span>
                     </div>
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

        {activeTab === 'recycle' && (
          <div className="tab-view">
             <div className="glass-panel w-full h-full overflow-auto">
                <h2 className="tab-title flex items-center gap-2">
                   <Trash2 className="text-[#00f0ff]" size={24} />
                   Recycle Bin & Neural Profiler
                </h2>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                   {/* Glyph Profiling Table */}
                   <div className="xl:col-span-2 space-y-6">
                      <div className="glass-panel p-6 bg-black/40 border-white/5">
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-[#00f0ff]" />
                            Active Glyph Profiles
                         </h3>
                         <table className="bom-table text-sm">
                            <thead>
                               <tr>
                                  <th>Glyph ID</th>
                                  <th>Architecture</th>
                                  <th>Integrity</th>
                                  <th>Target Folder</th>
                                  <th>Status</th>
                               </tr>
                            </thead>
                            <tbody>
                               {latticeData.GlyphProfiling.map(glyph => (
                                  <tr key={glyph.id}>
                                     <td className="font-mono text-[#00f0ff]">{glyph.id}</td>
                                     <td>{glyph.type}</td>
                                     <td>
                                        <div className="flex items-center gap-2">
                                           <div className="h-1.5 w-12 bg-white/10 rounded-full overflow-hidden">
                                              <div 
                                                 className="h-full bg-[#00f0ff]" 
                                                 style={{ width: `${glyph.integrity * 100}%`, backgroundColor: glyph.integrity < 0.2 ? '#ff3333' : '#00f0ff' }}
                                              ></div>
                                           </div>
                                           <span>{(glyph.integrity * 100).toFixed(0)}%</span>
                                        </div>
                                     </td>
                                     <td className="text-[10px] font-mono opacity-60">{glyph.folder}</td>
                                     <td>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                           {glyph.integrity < 0.2 ? 'DEGRADED' : 'STABLE'}
                                        </span>
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>

                      <div className="glass-panel p-6 bg-black/40 border-white/5">
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-[#7000ff]" />
                            Bin Diagnostics
                         </h3>
                         <div className="security-log h-32 overflow-y-auto">
                            <div className="log-entry">[03:45:12] INITIALIZING RECYCLE PROTOCOL...</div>
                            <div className="log-entry">[03:45:15] SCANNING NEW PYTHON RESORT LATTICE...</div>
                            <div className="log-entry text-[#00f0ff]">[03:45:20] RECOGNIZED GLYPH-01: SPECTRAL SIGNATURE DETECTED</div>
                            <div className="log-entry text-[#7000ff]">[03:45:22] SYNCING GLYPH-02 TO TEMPORAL_LATTICE</div>
                            <div className="log-entry text-alert">[03:45:25] WARNING: GLYPH-03 INTEGRITY AT 5% - RECYCLING INITIATED</div>
                            <div className="log-entry animate-pulse">[03:45:30] AWAITING AGENT COMMANDS...</div>
                         </div>
                      </div>
                   </div>

                   {/* Lattice Folder Structure */}
                   <div className="xl:col-span-1">
                      <div className="glass-panel p-6 bg-black/40 border-white/5 h-full">
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FolderTree size={18} className="text-[#00f0ff]" />
                            Lattice Structure
                         </h3>
                         <p className="text-[10px] text-muted mb-6">Hierarchy populated from <code>excel_db.xlsx</code> (Local Mirror)</p>
                         
                         <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                               <FolderTree size={16} /> ROOT/
                            </div>
                            {latticeData.LatticeFolders.map(folder => (
                               <div key={folder.path} className="ml-4 p-3 border-l border-white/10 flex flex-col gap-2 hover:bg-white/5 transition-colors cursor-pointer group">
                                  <div className="flex justify-between items-center">
                                     <span className="text-xs font-mono group-hover:text-[#00f0ff] transition-colors">
                                        {folder.path.split('/').pop()}
                                     </span>
                                     <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                        folder.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 
                                        folder.status === 'SYNCING' ? 'bg-[#7000ff]/20 text-[#7000ff]' : 
                                        'bg-yellow-500/20 text-yellow-400'
                                     }`}>
                                        {folder.status}
                                     </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-white/20" style={{ width: folder.capacity }}></div>
                                     </div>
                                     <span className="text-[9px] text-muted">{folder.capacity}</span>
                                  </div>
                               </div>
                            ))}
                         </div>

                         <div className="mt-8 pt-6 border-t border-white/5">
                            <button className="btn w-full text-xs" onClick={() => fetch('http://localhost:4432/api/sync', { method: 'POST' })}>
                               Sync Excel Database
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
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
                         <strong className="text-white">HOUSTON, TX</strong> — NetworkBuster today announced significant advancements in their ongoing NASA SBIR Ignite project. The latest system deployment features an interactive 3D PCB schematic viewer equipped with real-time telemetry, precision yield mapping capabilities, and aerospace-grade security partitions. Crucially, the system introduces an agent for each pixel and region, representing a key milestone that directly ties into earlier work on the Network Buster OS and its advanced agent management.
                      </p>
                      <p>
                         "This deployment marks a new era in secure, real-time payload visualization," stated the lead engineering team at NetworkBuster. "By integrating advanced diagnostic controls with immediate network synchronization, we are setting a new standard for high-fidelity aerospace telemetry systems."
                      </p>
                      <p>
                         The newly launched <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>Preciseliens</span> framework prioritizes secure, real-time payload visualization. It boasts seamless integration with existing network infrastructure, automated security partition management, real-time hardware telemetry streams, and live BOM tracking, which are all accessible through a unified high-performance interface.
                      </p>
                      <p>
                         NetworkBuster is also proud to announce the transition to the <strong>"New Python Resort"</strong> environment. This strategic move involves re-platforming the core telemetry back-end to a highly optimized Python-based infrastructure, enabling unprecedented performance for neural agent management across the SBIR Ignite platform.
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

        {activeTab === 'recycle' && (
          <div className="tab-view">
             <div className="glass-panel w-full h-full overflow-auto">
                <h2 className="tab-title flex items-center gap-2">
                  <Trash2 className="text-[#ff3333]" size={24} />
                  Glyph Recycle & Profiler
                </h2>
                <div className="p-6">
                    <p className="text-muted mb-6">Analyzing discarded neural glyphs for pattern recovery and architectural optimization in the New Python Resort environment.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'GLYPH-01', type: 'Spectral', status: 'PROFILED', integrity: '94%' },
                          { id: 'GLYPH-02', type: 'Temporal', status: 'RECYCLING', integrity: '22%' },
                          { id: 'GLYPH-03', type: 'Spatial', status: 'DEGRADED', integrity: '5%' }
                        ].map(glyph => (
                          <div key={glyph.id} className="p-4 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="font-mono text-sm font-bold text-white">{glyph.id}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                      glyph.status === 'PROFILED' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 
                                      glyph.status === 'RECYCLING' ? 'bg-[#7000ff]/20 text-[#7000ff]' : 'bg-[#ff3333]/20 text-[#ff3333]'
                                  }`}>{glyph.status}</span>
                              </div>
                              <div className="text-xs text-muted mb-2">Type: {glyph.type}</div>
                              <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-white/30" style={{ width: glyph.integrity }}></div>
                                  </div>
                                  <span className="text-[10px] font-mono text-muted">{glyph.integrity}</span>
                              </div>
                          </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-black/40 border border-dashed border-white/20 rounded-lg">
                        <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-[#ff3333]">Bin Diagnostics</h4>
                        <div className="space-y-2 font-mono text-[10px] text-muted">
                            <p>[03:51:22] INITIATING GLYPH PROFILE SCAN...</p>
                            <p>[03:51:23] RECOGNIZED 3 DISCARDED NEURAL FRAGMENTS</p>
                            <p>[03:51:25] GLYPH-01: SUCCESSFUL RECONSTRUCTION FROM RECYCLE_BIN_0x04</p>
                            <p className="text-white animate-pulse">_ AWAITING AGENT COMMAND FOR RECOVERY...</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'lattice' && (
          <div className="tab-view">
             <div className="glass-panel w-full h-full overflow-auto">
                <h2 className="tab-title flex items-center gap-2">
                  <Network className="text-[#00f0ff]" size={24} />
                  Folder Lattice Explorer
                </h2>
                <div className="p-6">
                    <p className="text-muted mb-6">Visualizing hierarchical folder lattice synchronized from the Excel master database.</p>
                    <div className="lattice-container grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                          { name: 'Root_Lattice', children: ['Region_Alpha', 'Region_Beta', 'Region_Gamma'] },
                          { name: 'Region_Alpha', children: ['Pixel_0x01', 'Pixel_0x02'] },
                          { name: 'Region_Beta', children: ['Pixel_0x03', 'Pixel_0x04'] },
                          { name: 'Region_Gamma', children: ['Pixel_0x05'] }
                        ].map((node, i) => (
                          <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg relative overflow-hidden group hover:border-[#00f0ff]/50 transition-all">
                              <div className="flex items-center gap-2 mb-4">
                                  <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></div>
                                  <span className="font-mono text-sm font-bold text-white uppercase">{node.name}</span>
                              </div>
                              <div className="space-y-2 pl-4 border-l border-white/10">
                                  {node.children.map((child, j) => (
                                      <div key={j} className="text-[10px] font-mono text-muted hover:text-[#00f0ff] cursor-pointer transition-colors flex items-center gap-2">
                                          <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                          {child}
                                      </div>
                                  ))}
                              </div>
                              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Network size={12} className="text-[#00f0ff]/30" />
                              </div>
                          </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 flex gap-4">
                        <button className="btn flex items-center gap-2">
                            <Activity size={16} /> Sync Excel Database
                        </button>
                        <button className="btn bg-white/5 border-white/10">
                            Rebuild Lattice Structure
                        </button>
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
