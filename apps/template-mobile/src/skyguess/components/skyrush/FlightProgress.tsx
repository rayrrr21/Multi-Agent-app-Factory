import React from 'react';

export interface FlightProgressProps {
  distanceMiles: number;
}

export const EARTH_CIRCUMFERENCE_MILES = 24901;

export const FlightProgress: React.FC<FlightProgressProps> = ({ distanceMiles }) => {
  const currentLap = Math.floor(distanceMiles / EARTH_CIRCUMFERENCE_MILES) + 1;
  const milesInCurrentLap = distanceMiles % EARTH_CIRCUMFERENCE_MILES;
  const progressPercent = Math.min(100, Math.max(0, (milesInCurrentLap / EARTH_CIRCUMFERENCE_MILES) * 100));

  return (
    <div style={{ marginTop: '8px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '700', color: '#94A3B8', marginBottom: '4px' }}>
        <span>LAP {currentLap} ({milesInCurrentLap.toLocaleString()} / {EARTH_CIRCUMFERENCE_MILES.toLocaleString()} MI)</span>
        <span>🌎 EARTH CIRCUMFERENCE</span>
      </div>

      <div style={{ height: '6px', backgroundColor: '#1E293B', borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)',
            borderRadius: '4px',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 8px rgba(56, 189, 248, 0.6)',
          }}
        />
      </div>
    </div>
  );
};
