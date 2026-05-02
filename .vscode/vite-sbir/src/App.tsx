import { useState, useEffect } from 'react';
import SchematicViewer from './components/SchematicViewer';
import { Cpu, Activity, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

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
          <div className="menu-item active">
            <Cpu size={20} />
            <span>Payload Schematic</span>
          </div>
          <div className="menu-item">
            <Activity size={20} />
            <span>Telemetry</span>
          </div>
          <div className="menu-item">
            <ShieldAlert size={20} />
            <span>Security Partition</span>
          </div>
          <div className="menu-item">
            <Zap size={20} />
            <span>Preciseliens Yield</span>
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

      {/* Main 3D Canvas Area */}
      <main className="main-content">
        <SchematicViewer isDeauthing={isDeauthing} components={bom} />
        
        {/* UI Overlays */}
        <div className="ui-overlay">
          <div className="glass-panel">
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
        </div>

        <div className="controls">
          <button className="btn">Run Diagnostics</button>
          <button className="btn">View BOM</button>
          <button className="btn" onClick={handleDeauth} style={{
            borderColor: isDeauthing ? '#ff3333' : '',
            color: isDeauthing ? '#ff3333' : ''
          }}>
            {isDeauthing ? <><AlertTriangle size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> DEAUTHING</> : 'Deauth Partition'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
