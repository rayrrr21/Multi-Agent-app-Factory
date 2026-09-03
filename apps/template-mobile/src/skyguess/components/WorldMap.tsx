import React from 'react';

export interface WorldMapProps {
  selectedPin: { lat: number; lng: number };
  onPinSelect: (coords: { lat: number; lng: number }) => void;
  onSubmitGuess: () => void;
  onClose: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  selectedPin,
  onPinSelect,
  onSubmitGuess,
  onClose,
}) => {
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel coordinates to latitude/longitude (-180 to 180, -90 to 90)
    const lng = (x / rect.width) * 360 - 180;
    const lat = 90 - (y / rect.height) * 180;

    onPinSelect({
      lat: Math.round(lat * 10) / 10,
      lng: Math.round(lng * 10) / 10,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        color: '#F8FAFC',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>MAKE YOUR GUESS</h2>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px' }}>
            Tap anywhere on the map to place your pin, then lock in your guess.
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#EF4444',
            fontSize: '24px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ✕
        </button>
      </div>

      {/* Interactive Map Canvas */}
      <div
        onClick={handleMapClick}
        style={{
          flex: 1,
          backgroundColor: '#0F172A',
          borderRadius: '16px',
          border: '2px solid #38BDF8',
          position: 'relative',
          backgroundImage:
            'radial-gradient(#334155 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          cursor: 'crosshair',
          overflow: 'hidden',
        }}
      >
        {/* World Grid Lines Overlay */}
        <svg width="100%" height="100%" style={{ opacity: 0.35, position: 'absolute' }}>
          {/* Equator & Prime Meridian */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6" />
          {/* Tropics */}
          <line x1="0" y1="36.8%" x2="100%" y2="36.8%" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3" />
          <line x1="0" y1="63.2%" x2="100%" y2="63.2%" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3" />
        </svg>

        {/* Selected Pin */}
        <div
          style={{
            position: 'absolute',
            left: `${((selectedPin.lng + 180) / 360) * 100}%`,
            top: `${((90 - selectedPin.lat) / 180) * 100}%`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            transition: 'all 0.1s ease',
          }}
        >
          <div style={{ fontSize: '32px' }}>📍</div>
          <div
            style={{
              backgroundColor: '#0284C7',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {selectedPin.lat}°, {selectedPin.lng}°
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#94A3B8' }}>
          Pin Coordinates: <strong>{selectedPin.lat}°, {selectedPin.lng}°</strong>
        </span>
        <button
          onClick={onSubmitGuess}
          style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '800',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
          }}
        >
          LOCK IN GUESS 🎯
        </button>
      </div>
    </div>
  );
};
