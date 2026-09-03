import React from 'react';

export interface AltitudeControlProps {
  altitudeLevel: '30,000 FT' | '10,000 FT' | '3,000 FT';
  altitudeMultiplier: number;
  onDescend: () => void;
}

export const AltitudeControl: React.FC<AltitudeControlProps> = ({
  altitudeLevel,
  altitudeMultiplier,
  onDescend,
}) => {
  const getNextMultiplier = () => {
    if (altitudeLevel === '30,000 FT') return 3;
    if (altitudeLevel === '10,000 FT') return 1;
    return 1;
  };

  const getAltitudeAngle = () => {
    if (altitudeLevel === '30,000 FT') return '0deg';
    if (altitudeLevel === '10,000 FT') return '25deg';
    return '45deg';
  };

  const getAltitudeColor = () => {
    if (altitudeLevel === '30,000 FT') return '#38BDF8';
    if (altitudeLevel === '10,000 FT') return '#F59E0B';
    return '#10B981';
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0F172A',
        padding: '12px 18px',
        borderRadius: '14px',
        border: `1px solid ${getAltitudeColor()}`,
        boxShadow: `0 4px 14px ${getAltitudeColor()}22`,
        marginTop: '10px',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Animated Airplane Flight Trajectory */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            fontSize: '22px',
            transform: `rotate(${getAltitudeAngle()})`,
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'inline-block',
          }}
        >
          ✈️
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>ALTITUDE: <strong style={{ color: getAltitudeColor() }}>{altitudeLevel}</strong></span>
            <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: `${getAltitudeColor()}22`, color: getAltitudeColor(), padding: '2px 8px', borderRadius: '8px', border: `1px solid ${getAltitudeColor()}44` }}>
              {altitudeMultiplier}× MULTIPLIER
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
            {altitudeLevel === '30,000 FT' ? 'High Altitude Orbit (Widest View)' : altitudeLevel === '10,000 FT' ? 'Mid Altitude Descent (Context Revealed)' : 'Low Altitude Flyby (Maximum Detail)'}
          </div>
        </div>
      </div>

      {/* 1-Thumb Descend Action Button */}
      {altitudeLevel !== '3,000 FT' ? (
        <button
          onClick={onDescend}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '800',
            borderRadius: '10px',
            border: '1px solid #F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🛬 DESCEND</span>
          <span style={{ fontSize: '11px', opacity: 0.8 }}>({getNextMultiplier()}×)</span>
        </button>
      ) : (
        <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '800', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          ✓ TOUCHDOWN LEVEL
        </span>
      )}
    </div>
  );
};
