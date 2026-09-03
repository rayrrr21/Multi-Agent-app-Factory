import React, { useState } from 'react';

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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

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
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        color: '#F8FAFC',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>SELECT LOCATION ON EARTH</h2>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px' }}>Tap landmasses to drop pin</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
            style={{ padding: '6px 12px', fontSize: '14px', fontWeight: '700', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#FFF', cursor: 'pointer' }}
          >
            🔍 +
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 1))}
            style={{ padding: '6px 12px', fontSize: '14px', fontWeight: '700', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#FFF', cursor: 'pointer' }}
          >
            🔍 -
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '8px' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Interactive Geographic World Map Canvas */}
      <div
        onClick={handleMapClick}
        style={{
          flex: 1,
          backgroundColor: '#0A1120',
          borderRadius: '16px',
          border: '2px solid #0284C7',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'crosshair',
          boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
        }}
      >
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Oceans Backdrop */}
          <rect width="1000" height="500" fill="#0B192C" />

          {/* Graticule Lines (Equator & Meridian) */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" strokeDasharray="6 4" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" strokeDasharray="6 4" />

          {/* ------------------------------------------------------------- */}
          {/* RECOGNIZABLE CONTINENTS & LANDMASS SVG PATHS */}
          {/* ------------------------------------------------------------- */}

          {/* North America */}
          <path
            d="M 120 60 L 280 60 L 320 120 L 290 180 L 260 220 L 220 280 L 190 270 L 160 220 L 110 180 L 80 140 Z"
            fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"
          />
          {/* Central America & Caribbean */}
          <path d="M 220 280 L 240 310 L 260 300 L 240 280 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />

          {/* South America */}
          <path
            d="M 260 300 L 340 330 L 380 400 L 320 480 L 280 460 L 260 380 L 240 330 Z"
            fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"
          />

          {/* Europe */}
          <path
            d="M 460 70 L 560 60 L 600 120 L 540 160 L 480 160 L 450 120 Z"
            fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"
          />
          {/* British Isles */}
          <path d="M 440 100 L 460 90 L 460 110 L 440 120 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />

          {/* Africa */}
          <path
            d="M 460 170 L 580 170 L 640 230 L 590 340 L 520 420 L 480 340 L 440 250 Z"
            fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"
          />
          {/* Madagascar */}
          <path d="M 640 340 L 660 330 L 650 370 L 630 370 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />

          {/* Asia */}
          <path
            d="M 580 60 L 920 60 L 960 160 L 880 260 L 820 280 L 760 270 L 720 220 L 660 220 L 600 120 Z"
            fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"
          />
          {/* Indian Subcontinent */}
          <path d="M 680 220 L 740 220 L 720 290 L 690 280 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Japan Archipelagos */}
          <path d="M 880 140 L 910 130 L 900 180 L 880 170 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />

          {/* Australia & Oceania */}
          <path
            d="M 780 340 L 900 330 L 920 400 L 880 440 L 800 430 L 760 380 Z"
            fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"
          />
          {/* New Zealand */}
          <path d="M 940 420 L 960 410 L 950 450 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />

          {/* Antarctica */}
          <path d="M 100 480 L 900 480 L 950 500 L 50 500 Z" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
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
          <div style={{ fontSize: '36px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }}>📍</div>
          <div
            style={{
              backgroundColor: '#0284C7',
              color: '#FFF',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '800',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
              border: '1px solid #38BDF8',
            }}
          >
            {selectedPin.lat}°, {selectedPin.lng}°
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
        <span style={{ fontSize: '14px', color: '#94A3B8' }}>
          Pin Coordinates: <strong style={{ color: '#38BDF8' }}>{selectedPin.lat}°, {selectedPin.lng}°</strong>
        </span>
        <button
          onClick={onSubmitGuess}
          style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '900',
            borderRadius: '12px',
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
