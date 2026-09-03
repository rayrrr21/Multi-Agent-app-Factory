import React from 'react';

export interface FlightOverScreenProps {
  distanceMiles: number;
  correctCount: number;
  bestStreak: number;
  maxCombo: number;
  isPersonalBest: boolean;
  onFlyAgain: () => void;
  onExit: () => void;
}

export const FlightOverScreen: React.FC<FlightOverScreenProps> = ({
  distanceMiles,
  correctCount,
  bestStreak,
  maxCombo,
  isPersonalBest,
  onFlyAgain,
  onExit,
}) => {
  const earthLaps = (distanceMiles / 24901).toFixed(1);

  return (
    <div
      style={{
        maxWidth: '540px',
        margin: '40px auto',
        padding: '36px 28px',
        backgroundColor: '#1E293B',
        borderRadius: '24px',
        border: '2px solid #EF4444',
        color: '#F8FAFC',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.3)',
      }}
    >
      <span style={{ fontSize: '52px' }}>💥</span>
      <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#EF4444', margin: '8px 0 4px 0', letterSpacing: '-0.02em' }}>
        FLIGHT OVER
      </h1>

      {isPersonalBest ? (
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#10B981', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', marginBottom: '12px' }}>
          🏆 NEW PERSONAL BEST RECORD!
        </div>
      ) : null}

      <div style={{ fontSize: '48px', fontWeight: '900', color: '#38BDF8', margin: '12px 0 2px 0', letterSpacing: '-0.03em' }}>
        {distanceMiles.toLocaleString()} <span style={{ fontSize: '20px', color: '#94A3B8' }}>MI</span>
      </div>

      <p style={{ color: '#CBD5E1', fontSize: '15px', fontStyle: 'italic', margin: '0 0 28px 0' }}>
        {parseFloat(earthLaps) >= 1 ? `${earthLaps}× around Earth!` : 'Almost 1 trip around Earth'}
      </p>

      {/* Compact Run Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155' }}>
          <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>CORRECT ANSWERS</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>
            {correctCount}
          </div>
        </div>

        <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155' }}>
          <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>LONGEST STREAK</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#F59E0B', marginTop: '4px' }}>
            🔥 {bestStreak}
          </div>
        </div>

        <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155' }}>
          <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>MAX COMBO</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#A855F7', marginTop: '4px' }}>
            ⚡ ×{maxCombo}
          </div>
        </div>

        <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155' }}>
          <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>ACCURACY</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#38BDF8', marginTop: '4px' }}>
            {correctCount > 0 ? Math.round((correctCount / (correctCount + 3)) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Hero 1-Tap FLY AGAIN Button */}
      <button
        onClick={onFlyAgain}
        style={{
          width: '100%',
          padding: '18px',
          fontSize: '20px',
          fontWeight: '900',
          borderRadius: '16px',
          border: 'none',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#FFFFFF',
          cursor: 'pointer',
          marginBottom: '12px',
          boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.4)',
          transition: 'all 0.2s ease',
        }}
      >
        ✈️ FLY AGAIN
      </button>

      <button
        onClick={onExit}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '12px',
          border: '1px solid #334155',
          backgroundColor: 'transparent',
          color: '#94A3B8',
          cursor: 'pointer',
        }}
      >
        Exit to Home
      </button>
    </div>
  );
};
