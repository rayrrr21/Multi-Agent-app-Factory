import React, { useState, useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { SEEDED_LOCATIONS } from './src/skyguess/data/locations';
import { calculateHaversineDistance, calculateDailyScore } from './src/skyguess/services/scoring';
import { WorldMap } from './src/skyguess/components/WorldMap';
import { LocationRecord } from './src/skyguess/types';

export default function App() {
  // Navigation & User Auth state
  const [currentPath, setCurrentPath] = useState('/');
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('Jane Doe');
  const [statusMessage, setStatusMessage] = useState('');

  // Configurable score decay constant (Correction 1: k = 1000)
  const [decayConstant] = useState(1000);

  // Daily SkyGuess Game State
  const [dailyStreak, setDailyStreak] = useState(7);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [dailyResult, setDailyResult] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState({ lat: 20, lng: 0 });

  // SkyRush Arcade Game State
  const [skyRushActive, setSkyRushActive] = useState(false);
  const [skyRushIndex, setSkyRushIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [distanceMiles, setDistanceMiles] = useState(0);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1);
  const [isFlightOver, setIsFlightOver] = useState(false);
  const [bestFlight, setBestFlight] = useState(18422);

  // Altitude Information Loss Mechanic (Correction 7: framing/crop variants, not CSS blur)
  const [altitudeLevel, setAltitudeLevel] = useState('30,000 FT');
  const [altitudeMultiplier, setAltitudeMultiplier] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null);

  // Seeded Daily Location
  const todayLocation = SEEDED_LOCATIONS[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname || '/');

      const handlePopState = () => {
        setCurrentPath(window.location.pathname || '/');
      };
      window.addEventListener('popstate', handlePopState);

      const auth = window.localStorage.getItem('auth');
      setIsAuth(auth === 'true');

      const savedName = window.localStorage.getItem('displayName');
      if (savedName) setDisplayName(savedName);

      const savedBest = window.localStorage.getItem('skyguess_best_flight');
      if (savedBest) setBestFlight(parseInt(savedBest, 10));

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  const navigate = (path) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
      window.history.pushState(null, '', path);
    }
  };

  const handleLoginSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth', 'true');
    }
    setIsAuth(true);
    navigate('/profile');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth', 'false');
    }
    setIsAuth(false);
    navigate('/login');
  };

  const handleSaveProfile = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('displayName', displayName);
    }
    setStatusMessage('Profile updated');
  };

  // --------------------------------------------------------------------------
  // DAILY SKYGUESS LOGIC (Correction 1 & 2: Configurable decay k=1000, No fake percentiles)
  // --------------------------------------------------------------------------
  const handleLockDailyGuess = () => {
    const distKm = calculateHaversineDistance(
      selectedPin.lat,
      selectedPin.lng,
      todayLocation.latitude,
      todayLocation.longitude
    );

    // Score = round(10,000 * Math.exp(-distanceKm / 1000))
    const score = calculateDailyScore(distKm, decayConstant);

    setDailyResult({
      distKm,
      score,
      guessLat: selectedPin.lat,
      guessLng: selectedPin.lng,
    });
    setDailyCompleted(true);
    setDailyStreak((prev) => prev + 1);
    setMapOpen(false);
  };

  // --------------------------------------------------------------------------
  // SKYRUSH ARCADE LOGIC (Correction 7 & 8: altitude framing & 4 question categories)
  // --------------------------------------------------------------------------
  const startSkyRushRun = () => {
    setSkyRushActive(true);
    setSkyRushIndex(0);
    setLives(3);
    setDistanceMiles(0);
    setStreak(0);
    setCombo(1);
    setIsFlightOver(false);
    setAltitudeLevel('30,000 FT');
    setAltitudeMultiplier(5);
    setSelectedAnswer(null);
    setFeedbackState(null);
  };

  const currentRushLocation = SEEDED_LOCATIONS[skyRushIndex % SEEDED_LOCATIONS.length];

  // 4 Specific Question Categories (Correction 8: Country, Region, City, Terrain)
  const getSkyRushQuestion = (loc) => {
    const categoryIndex = skyRushIndex % 4;

    if (categoryIndex === 0) {
      return {
        prompt: `Country Check: Is this ${loc.country} or ${loc.distractors.country}?`,
        optionA: loc.country,
        optionB: loc.distractors.country,
        correct: 'A',
        category: 'Country',
      };
    }
    if (categoryIndex === 1) {
      return {
        prompt: `Region Check: Is this ${loc.region} or ${loc.distractors.region}?`,
        optionA: loc.distractors.region,
        optionB: loc.region,
        correct: 'B',
        category: 'Region',
      };
    }
    if (categoryIndex === 2) {
      return {
        prompt: `City Check: Is this ${loc.city} or ${loc.distractors.city}?`,
        optionA: loc.city,
        optionB: loc.distractors.city,
        correct: 'A',
        category: 'City',
      };
    }
    return {
      prompt: `Terrain Classification: ${loc.terrain} or ${loc.distractors.terrain}?`,
      optionA: loc.distractors.terrain,
      optionB: loc.terrain,
      correct: 'B',
      category: 'Terrain',
    };
  };

  const currentQuestion = getSkyRushQuestion(currentRushLocation);

  // Altitude Information Loss Mechanic (Correction 7: Crop / Scale Viewport Framing)
  const handleDescendAltitude = () => {
    if (altitudeLevel === '30,000 FT') {
      setAltitudeLevel('10,000 FT');
      setAltitudeMultiplier(3);
    } else if (altitudeLevel === '10,000 FT') {
      setAltitudeLevel('3,000 FT');
      setAltitudeMultiplier(1);
    }
  };

  const getImageForAltitude = (loc) => {
    if (altitudeLevel === '30,000 FT' && loc.crop30k) return loc.crop30k;
    if (altitudeLevel === '10,000 FT' && loc.crop10k) return loc.crop10k;
    return loc.imageUrl;
  };

  const handleAnswerSkyRush = (option) => {
    if (feedbackState || isFlightOver) return;
    setSelectedAnswer(option);

    if (option === currentQuestion.correct) {
      setFeedbackState('correct');
      const distanceGained = Math.round(450 * combo * (altitudeMultiplier / 2));
      const newTotalDistance = distanceMiles + distanceGained;
      setDistanceMiles(newTotalDistance);
      setStreak((prev) => prev + 1);
      setCombo((prev) => Math.min(prev + 1, 8));

      if (newTotalDistance > bestFlight) {
        setBestFlight(newTotalDistance);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('skyguess_best_flight', newTotalDistance.toString());
        }
      }

      setTimeout(() => {
        setFeedbackState(null);
        setSelectedAnswer(null);
        setAltitudeLevel('30,000 FT');
        setAltitudeMultiplier(5);
        setSkyRushIndex((prev) => prev + 1);
      }, 900);
    } else {
      setFeedbackState('wrong');
      const newLives = lives - 1;
      setLives(newLives);
      setCombo(1);

      if (newLives <= 0) {
        setTimeout(() => {
          setIsFlightOver(true);
        }, 900);
      } else {
        setTimeout(() => {
          setFeedbackState(null);
          setSelectedAnswer(null);
          setAltitudeLevel('30,000 FT');
          setAltitudeMultiplier(5);
          setSkyRushIndex((prev) => prev + 1);
        }, 900);
      }
    }
  };

  const fillDemoCreds = () => {
    setEmail('pilot@skyguess.app');
    setPassword('SkyGuess2026!');
  };

  // Legacy Playwright contract compatibility: LoginForm
  const renderLoginForm = () => {
    if (Platform.OS === 'web') {
      return (
        <div style={{
          maxWidth: '440px',
          margin: '40px auto',
          padding: '32px',
          borderRadius: '16px',
          background: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          color: '#F8FAFC'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '36px' }}>✈️</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', marginBottom: '4px' }}>Pilot Sign In</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Save your daily streaks and SkyRush flight records</p>
          </div>

          <form data-testid="login-form" onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>Email Address</label>
              <input
                data-testid="email-input"
                name="email"
                type="email"
                placeholder="pilot@skyguess.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>Password</label>
              <input
                data-testid="password-input"
                name="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="button"
              onClick={fillDemoCreds}
              style={{ background: 'none', border: 'none', color: '#38BDF8', fontSize: '13px', cursor: 'pointer', textAlign: 'left', textDecoration: 'underline' }}
            >
              Auto-fill demo credentials
            </button>

            <button
              type="submit"
              data-testid="login-submit-btn"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(2, 132, 199, 0.39)'
              }}
            >
              Log In & Save Streak →
            </button>
          </form>
        </div>
      );
    }

    return (
      <View style={styles.content} testID="login-form">
        <Text style={styles.title}>Player Sign In</Text>
        <TextInput testID="email-input" style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput testID="password-input" style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Button testID="login-submit-btn" title="Log In" onPress={handleLoginSubmit} />
      </View>
    );
  };

  const renderContent = () => {
    // ROUTE: /login
    if (currentPath === '/login') {
      return renderLoginForm();
    }

    // ROUTE: /profile
    if (currentPath === '/profile') {
      if (!isAuth) {
        return renderLoginForm();
      }

      if (Platform.OS === 'web') {
        return (
          <div style={{ maxWidth: '640px', margin: '40px auto', padding: '32px', borderRadius: '16px', backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                {displayName.charAt(0) || 'P'}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px' }}>{displayName}</h2>
                <span style={{ fontSize: '13px', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '4px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '4px' }}>
                  ✈️ SkyGuess Explorer • 🔥 {dailyStreak} Day Streak
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>Pilot Call Sign / Display Name</label>
                <input
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{ width: '100%', padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#F8FAFC', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  type="submit"
                  data-testid="save-profile"
                  style={{ padding: '12px 24px', fontSize: '15px', fontWeight: '600', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', cursor: 'pointer' }}
                >
                  Save Profile Changes
                </button>
                {statusMessage ? <span style={{ color: '#10B981', fontSize: '14px', fontWeight: '600' }}>✓ {statusMessage}</span> : null}
              </div>
            </form>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #334155' }}>
              <button
                type="button"
                data-testid="logout"
                onClick={handleLogout}
                style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600', borderRadius: '8px', border: '1px solid #EF4444', backgroundColor: 'transparent', color: '#EF4444', cursor: 'pointer' }}
              >
                Log Out
              </button>
            </div>
          </div>
        );
      }

      return (
        <View style={styles.content}>
          <Text style={styles.title}>User Profile</Text>
          <TextInput name="displayName" style={styles.input} value={displayName} onChangeText={setDisplayName} />
          <Button testID="save-profile" title="Save Profile" onPress={handleSaveProfile} />
          {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
          <Button testID="logout" title="Log Out" onPress={handleLogout} />
        </View>
      );
    }

    // ROUTE: /dashboard
    if (currentPath === '/dashboard') {
      if (Platform.OS === 'web') {
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px', color: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0' }}>SkyGuess Global Leaderboard & Stats</h1>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>Daily challenge rankings and SkyRush flight distance telemetry</p>
              </div>
              <button
                type="button"
                data-testid="logout"
                onClick={handleLogout}
                style={{ padding: '10px 18px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#F8FAFC', cursor: 'pointer' }}
              >
                Log Out
              </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>BEST SKYRUSH FLIGHT</span>
                <div style={{ fontSize: '30px', fontWeight: '800', color: '#38BDF8', marginTop: '6px' }}>{bestFlight.toLocaleString()} mi</div>
                <span style={{ fontSize: '12px', color: '#10B981' }}>Global Rank #42</span>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>DAILY STREAK</span>
                <div style={{ fontSize: '30px', fontWeight: '800', color: '#F59E0B', marginTop: '6px' }}>🔥 {dailyStreak} Days</div>
                <span style={{ fontSize: '12px', color: '#F59E0B' }}>Active Streak</span>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>SEEDED LOCATIONS</span>
                <div style={{ fontSize: '30px', fontWeight: '800', color: '#A855F7', marginTop: '6px' }}>{SEEDED_LOCATIONS.length} Locations</div>
                <span style={{ fontSize: '12px', color: '#A855F7' }}>Explicit Licensing</span>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>SCORING DECAY CONSTANT</span>
                <div style={{ fontSize: '30px', fontWeight: '800', color: '#10B981', marginTop: '6px' }}>k = {decayConstant}</div>
                <span style={{ fontSize: '12px', color: '#10B981' }}>Configurable Curve</span>
              </div>
            </div>
          </div>
        );
      }

      return (
        <View style={styles.content}>
          <Text style={styles.title}>Dashboard</Text>
          <Button testID="logout" title="Log Out" onPress={handleLogout} />
        </View>
      );
    }

    // ROUTE: / (Home - SKYGUESS Main Hub)
    if (Platform.OS === 'web') {
      // ----------------------------------------------------------------------
      // MODE 2 — SKYRUSH ARCADE ACTIVE RUN
      // ----------------------------------------------------------------------
      if (skyRushActive) {
        if (isFlightOver) {
          return (
            <div style={{ maxWidth: '540px', margin: '40px auto', padding: '36px 28px', backgroundColor: '#1E293B', borderRadius: '20px', border: '2px solid #EF4444', color: '#F8FAFC', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25)' }}>
              <span style={{ fontSize: '48px' }}>💥</span>
              <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#EF4444', margin: '8px 0 4px 0' }}>FLIGHT OVER</h1>
              <p style={{ color: '#94A3B8', fontSize: '15px', fontStyle: 'italic', marginBottom: '28px' }}>You crashed in Mongolia.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
                <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '600' }}>DISTANCE FLOWN</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#38BDF8', marginTop: '4px' }}>✈️ {distanceMiles.toLocaleString()} mi</div>
                </div>
                <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '600' }}>ROUNDS COMPLETED</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#10B981', marginTop: '4px' }}>🌎 {skyRushIndex}</div>
                </div>
                <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '600' }}>BEST STREAK</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#F59E0B', marginTop: '4px' }}>🔥 {streak}</div>
                </div>
                <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '600' }}>MAX COMBO</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#A855F7', marginTop: '4px' }}>⚡ ×{combo}</div>
                </div>
              </div>

              <button
                onClick={startSkyRushRun}
                style={{ width: '100%', padding: '16px', fontSize: '18px', fontWeight: '800', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)' }}
              >
                ✈️ FLY AGAIN
              </button>

              <button
                onClick={() => setSkyRushActive(false)}
                style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: '600', borderRadius: '10px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94A3B8', cursor: 'pointer' }}
              >
                Exit to Main Menu
              </button>
            </div>
          );
        }

        return (
          <div style={{ maxWidth: '640px', margin: '20px auto', padding: '20px', color: '#F8FAFC' }}>
            {/* SkyRush Top HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', backgroundColor: '#1E293B', borderRadius: '14px', border: '1px solid #334155', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '800', color: '#38BDF8' }}>
                ✈️ <span>{distanceMiles.toLocaleString()} MI</span>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '14px', fontWeight: '700' }}>
                <span style={{ color: '#F59E0B' }}>🔥 {streak}</span>
                <span style={{ color: '#A855F7' }}>⚡ ×{combo}</span>
                <span>
                  {'❤️'.repeat(lives)}
                  {'🖤'.repeat(3 - lives)}
                </span>
              </div>
            </div>

            {/* Altitude Information Loss Mechanic (Correction 7: Framing / Viewport context) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', padding: '10px 16px', borderRadius: '10px', border: '1px solid #334155', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#F8FAFC' }}>
                ALTITUDE: <span style={{ color: '#F59E0B' }}>{altitudeLevel}</span> ({altitudeMultiplier}× Reward)
              </span>
              {altitudeLevel !== '3,000 FT' ? (
                <button
                  onClick={handleDescendAltitude}
                  style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '700', borderRadius: '6px', border: '1px solid #F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', cursor: 'pointer' }}
                >
                  🛬 DESCEND (More Context)
                </button>
              ) : null}
            </div>

            {/* Aerial Image Card with Altitude Crop Framing */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '320px', marginBottom: '20px', border: '1px solid #334155', backgroundColor: '#1E293B' }}>
              <img
                src={getImageForAltitude(currentRushLocation)}
                alt="Aerial view"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: altitudeLevel === '30,000 FT' ? 'contain' : 'cover',
                  padding: altitudeLevel === '30,000 FT' ? '24px' : '0',
                  transition: 'all 0.3s ease'
                }}
              />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
                {currentQuestion.category}: {currentQuestion.prompt}
              </div>
            </div>

            {/* 2-Choice Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                onClick={() => handleAnswerSkyRush('A')}
                disabled={feedbackState !== null}
                style={{
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '800',
                  borderRadius: '12px',
                  border: '2px solid #334155',
                  backgroundColor: feedbackState && selectedAnswer === 'A' ? (feedbackState === 'correct' ? '#10B981' : '#EF4444') : '#1E293B',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {currentQuestion.optionA}
              </button>

              <button
                onClick={() => handleAnswerSkyRush('B')}
                disabled={feedbackState !== null}
                style={{
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '800',
                  borderRadius: '12px',
                  border: '2px solid #334155',
                  backgroundColor: feedbackState && selectedAnswer === 'B' ? (feedbackState === 'correct' ? '#10B981' : '#EF4444') : '#1E293B',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {currentQuestion.optionB}
              </button>
            </div>
          </div>
        );
      }

      // ----------------------------------------------------------------------
      // MODE 1 — DAILY SKYGUESS PLAY & REVEAL MODAL
      // ----------------------------------------------------------------------
      return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 20px', color: '#F8FAFC' }}>
          {/* Main Tagline Banner */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SKYGUESS
            </h1>
            <p style={{ fontSize: '18px', color: '#38BDF8', fontWeight: '600', margin: 0 }}>
              See the world from above. Guess where you are.
            </p>
          </div>

          {/* Two Primary Mode Cards Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* CARD 1: DAILY SKYGUESS */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#38BDF8', letterSpacing: '0.05em' }}>DAILY SKYGUESS #042</span>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                    🔥 {dailyStreak}-day streak
                  </span>
                </div>

                <div style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
                  <img src={todayLocation.imageUrl} alt="Today's SkyGuess" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    Study the view. Find it on Earth.
                  </div>
                </div>
              </div>

              {dailyCompleted && dailyResult ? (
                <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '12px', border: '1px solid #10B981', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981' }}>{dailyResult.score.toLocaleString()} POINTS</div>
                  <div style={{ fontSize: '14px', color: '#F8FAFC', margin: '4px 0' }}>Distance: <strong>{dailyResult.distKm} km away</strong></div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', marginBottom: '8px' }}>(Development Data Curve k={decayConstant})</div>
                  <div style={{ fontSize: '13px', color: '#CBD5E1', fontWeight: '700' }}>Correct: {todayLocation.city}, {todayLocation.region}, {todayLocation.country}</div>
                  <p style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', marginTop: '6px', marginBottom: '12px' }}>"{todayLocation.fact}"</p>
                  
                  {/* Licensing attribution (Correction 3) */}
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '12px' }}>
                    📷 {todayLocation.attribution} • {todayLocation.license}
                  </div>

                  <button
                    onClick={() => alert(`SKYGUESS #042 🌎\n📍 ${dailyResult.score} pts\n🎯 ${dailyResult.distKm} km\n🔥 ${dailyStreak}-day streak\nCan you beat me?`)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#38BDF8', color: '#0F172A', fontWeight: '800', cursor: 'pointer' }}
                  >
                    SHARE RESULT 📤
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setMapOpen(true)}
                  style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '800', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(2, 132, 199, 0.4)' }}
                >
                  PLAY TODAY'S SKYGUESS 🎯
                </button>
              )}
            </div>

            {/* CARD 2: SKYRUSH ARCADE */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#A855F7', letterSpacing: '0.05em' }}>SKYRUSH ARCADE</span>
                  <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                    ✈️ Best: {bestFlight.toLocaleString()} mi
                  </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', color: '#F8FAFC' }}>How far can you fly?</h2>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.5', margin: '0 0 24px 0' }}>
                  Fast, 1-thumb friendly aerial recognition runs. Answer questions rapidly, avoid crashing, and fly around the world.
                </p>
              </div>

              <button
                onClick={startSkyRushRun}
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '800', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.4)' }}
              >
                START SKYRUSH RUN ✈️
              </button>
            </div>
          </div>

          {/* Abstracted WorldMap Component (Correction 9) */}
          {mapOpen ? (
            <WorldMap
              selectedPin={selectedPin}
              onPinSelect={setSelectedPin}
              onSubmitGuess={handleLockDailyGuess}
              onClose={() => setMapOpen(false)}
            />
          ) : null}
        </div>
      );
    }

    return (
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to SkyGuess</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Platform Navigation Header */}
      {Platform.OS === 'web' ? (
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          backgroundColor: '#0F172A',
          borderBottom: '1px solid #334155',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* App Logo & Title (E2E Contract Selector: data-testid="app-logo") */}
          <div
            data-testid="app-logo"
            onClick={() => { setSkyRushActive(false); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#FFF' }}>
              ✈️
            </div>
            <span style={{ fontSize: '20px', fontWeight: '900', color: '#F8FAFC', letterSpacing: '-0.01em' }}>
              SKYGUESS
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <button
              onClick={() => { setSkyRushActive(false); navigate('/'); }}
              style={{ background: 'none', border: 'none', color: currentPath === '/' && !skyRushActive ? '#38BDF8' : '#94A3B8', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
            >
              Daily SkyGuess
            </button>
            <button
              onClick={() => { navigate('/'); startSkyRushRun(); }}
              style={{ background: 'none', border: 'none', color: skyRushActive ? '#A855F7' : '#94A3B8', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
            >
              SkyRush Arcade
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', color: currentPath === '/dashboard' ? '#38BDF8' : '#94A3B8', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
            >
              Leaderboard & Stats
            </button>
            <button
              onClick={() => navigate('/profile')}
              style={{ background: 'none', border: 'none', color: currentPath === '/profile' ? '#38BDF8' : '#94A3B8', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
            >
              Pilot Profile
            </button>
          </nav>

          {/* User Auth Action Button */}
          <div>
            {isAuth ? (
              <button
                onClick={() => navigate('/profile')}
                style={{ backgroundColor: '#1E293B', color: '#38BDF8', border: '1px solid #38BDF8', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                ● Pilot ({displayName.split(' ')[0]})
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{ backgroundColor: '#0284C7', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                Sign In
              </button>
            )}
          </div>
        </header>
      ) : (
        <View testID="app-logo" style={styles.header}>
          <Text style={styles.headerText}>SkyGuess</Text>
        </View>
      )}

      {/* Main Screen Content */}
      <View style={styles.body}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 16, backgroundColor: '#1E293B', alignItems: 'center', borderBottomWidth: 1, borderColor: '#334155' },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#F8FAFC' },
  body: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24, color: '#F8FAFC' },
  input: { width: '80%', height: 40, borderColor: '#334155', borderWidth: 1, borderRadius: 4, marginBottom: 12, paddingHorizontal: 8, color: '#F8FAFC', backgroundColor: '#1E293B' },
  status: { color: '#10B981', marginVertical: 8 },
});

registerRootComponent(App);
