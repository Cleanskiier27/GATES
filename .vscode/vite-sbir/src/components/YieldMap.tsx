import { useEffect, useState } from 'react';

const generateYieldData = () => {
  const data = [];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 24; x++) {
      // Create a pattern with some "hot" and "cold" spots
      const distanceToCenter = Math.sqrt(Math.pow(x - 12, 2) + Math.pow(y - 8, 2));
      const baseYield = Math.max(0, 100 - (distanceToCenter * 4));
      const noise = (Math.random() * 20) - 10;
      let finalYield = Math.min(100, Math.max(0, baseYield + noise));
      
      // Simulate an anomaly cluster
      if (x > 18 && y < 5) {
         finalYield = Math.random() * 40 + 20; // 20-60%
      }
      
      data.push({ x, y, value: finalYield });
    }
  }
  return data;
};

const getColorForYield = (value: number) => {
  if (value > 90) return 'rgba(0, 255, 128, 0.8)'; // High - Green
  if (value > 75) return 'rgba(0, 240, 255, 0.8)'; // Good - Cyan
  if (value > 50) return 'rgba(255, 165, 0, 0.8)'; // Warning - Orange
  return 'rgba(255, 51, 51, 0.8)'; // Critical - Red
};

export default function YieldMap() {
  const [gridData, setGridData] = useState<{x: number, y: number, value: number}[]>([]);

  useEffect(() => {
    // Initial generation
    setGridData(generateYieldData());

    // Periodically update to simulate live analysis
    const interval = setInterval(() => {
      setGridData(generateYieldData());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="yield-map-container">
      <div className="yield-map-bg"></div>
      
      <div className="yield-map-grid">
        {gridData.map((cell, i) => (
          <div 
            key={i} 
            className="yield-map-cell"
            style={{
              backgroundColor: getColorForYield(cell.value),
              boxShadow: `0 0 8px ${getColorForYield(cell.value).replace('0.8', '0.4')}`
            }}
            title={`Region [${cell.x}, ${cell.y}]: ${cell.value.toFixed(1)}% Yield`}
          />
        ))}
      </div>
      
      <div className="yield-map-legend">
        <div className="legend-item"><div className="legend-dot" style={{backgroundColor: 'rgba(255, 51, 51, 0.8)'}}></div> &lt;50%</div>
        <div className="legend-item"><div className="legend-dot" style={{backgroundColor: 'rgba(255, 165, 0, 0.8)'}}></div> 50-75%</div>
        <div className="legend-item"><div className="legend-dot" style={{backgroundColor: 'rgba(0, 240, 255, 0.8)'}}></div> 75-90%</div>
        <div className="legend-item"><div className="legend-dot" style={{backgroundColor: 'rgba(0, 255, 128, 0.8)'}}></div> &gt;90%</div>
      </div>
    </div>
  );
}

