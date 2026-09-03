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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0F172A',
        padding: '10px 16px',
        borderRadius: '12px',
        border: '1px solid #334155',
        marginTop: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: '#CBD5E1' }}>
          ALTITUDE: <span style={{ color: '#F59E0B' }}>{altitudeLevel}</span>
        </span>
        <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '2px 8px', borderRadius: '8px' }}>
          {altitudeMultiplier}× REWARD
        </span>
      </div>

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
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          ↓ DESCEND ({getNextMultiplier()}×)
        </button>
      ) : (
        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>LOWEST ALTITUDE</span>
      )}
    </div>
  );
};
