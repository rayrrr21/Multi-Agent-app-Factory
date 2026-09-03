import React from 'react';

export interface SkyRushHUDProps {
  distanceMiles: number;
  streak: number;
  combo: number;
  lives: number;
  isNewBest: boolean;
}

export const SkyRushHUD: React.FC<SkyRushHUDProps> = ({
  distanceMiles,
  streak,
  combo,
  lives,
  isNewBest,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* LEFT: Prominent Distance Score (Telemetry) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '22px' }}>✈️</span>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#38BDF8', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {distanceMiles.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '700', color: '#94A3B8' }}>MI</span>
          </div>
          {isNewBest ? (
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🏆 NEW BEST FLIGHT!
            </span>
          ) : null}
        </div>
      </div>

      {/* CENTER: Streak & Combo Multiplier Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: '12px' }}>
          <span style={{ fontSize: '14px' }}>🔥</span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#F59E0B' }}>{streak}</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: combo > 1 ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)' : 'rgba(148, 163, 184, 0.1)',
            border: combo > 1 ? '1px solid #A855F7' : '1px solid #334155',
            padding: '4px 10px',
            borderRadius: '12px',
            transform: combo > 1 ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: combo > 1 ? '#A855F7' : '#94A3B8' }}>
            ×{combo}
          </span>
        </div>
      </div>

      {/* RIGHT: Airframe / Shield Indicator Lives */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {[1, 2, 3].map((shieldNum) => {
          const active = shieldNum <= lives;
          return (
            <div
              key={shieldNum}
              style={{
                width: '12px',
                height: '16px',
                borderRadius: '3px',
                backgroundColor: active ? '#10B981' : '#334155',
                boxShadow: active ? '0 0 10px rgba(16, 185, 129, 0.6)' : 'none',
                transition: 'all 0.3s ease',
                border: active ? '1px solid #34D399' : '1px solid #1E293B',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
