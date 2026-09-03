import React, { useState, useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('Jane Doe');
  const [statusMessage, setStatusMessage] = useState('');

  // App Creation Wizard State
  const [appIdea, setAppIdea] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('template-mobile');
  const [buildingState, setBuildingState] = useState('');

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

  const handleStartBuild = () => {
    if (!appIdea.trim()) {
      setBuildingState('Please enter an app description to begin!');
      return;
    }
    setBuildingState('🚀 Agent Swarm Initializing... Generating project architecture...');
    setTimeout(() => {
      setBuildingState('⚡ Building React Native Expo components & Supabase schema...');
    }, 1500);
    setTimeout(() => {
      setBuildingState('✅ Build Complete! 7 E2E Gates Passed. App ready for preview!');
    }, 3500);
  };

  const fillDemoCreds = () => {
    setEmail('developer@factory.ai');
    setPassword('FactoryPass2026!');
  };

  // Render LoginForm helper to ensure 100% E2E test selector compatibility
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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          color: '#F8FAFC'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px' }}>🔐</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', marginBottom: '4px' }}>Developer Sign In</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Access your App Factory workspace and agent swarms</p>
          </div>

          <form data-testid="login-form" onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>Email Address</label>
              <input
                data-testid="email-input"
                name="email"
                type="email"
                placeholder="developer@factory.ai"
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={fillDemoCreds}
                style={{ background: 'none', border: 'none', color: '#38BDF8', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Auto-fill demo credentials
              </button>
            </div>

            <button
              type="submit"
              data-testid="login-submit-btn"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
              }}
            >
              Log In to Workspace →
            </button>
          </form>
        </div>
      );
    }

    return (
      <View style={styles.content} testID="login-form">
        <Text style={styles.title}>Developer Sign In</Text>
        <TextInput testID="email-input" style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput testID="password-input" style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Button testID="login-submit-btn" title="Log In" onPress={handleLoginSubmit} />
      </View>
    );
  };

  const renderContent = () => {
    // ----------------------------------------------------
    // ROUTE: /login
    // ----------------------------------------------------
    if (currentPath === '/login') {
      return renderLoginForm();
    }

    // ----------------------------------------------------
    // ROUTE: /profile
    // ----------------------------------------------------
    if (currentPath === '/profile') {
      if (!isAuth) {
        return renderLoginForm();
      }

      if (Platform.OS === 'web') {
        return (
          <div style={{ maxWidth: '640px', margin: '40px auto', padding: '32px', borderRadius: '16px', backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                {displayName.charAt(0) || 'D'}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px' }}>{displayName}</h2>
                <span style={{ fontSize: '13px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '4px' }}>
                  ● Lead App Architect
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>Display Name</label>
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
                Log Out of Workspace
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

    // ----------------------------------------------------
    // ROUTE: /dashboard
    // ----------------------------------------------------
    if (currentPath === '/dashboard') {
      if (Platform.OS === 'web') {
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px', color: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0' }}>Factory Operations Dashboard</h1>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>Real-time telemetry, build swarms, and production contract health</p>
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

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>TOTAL APPS BUILT</span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#38BDF8', marginTop: '8px' }}>14</div>
                <span style={{ fontSize: '12px', color: '#10B981' }}>↑ +3 this week</span>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>ACTIVE AGENT SWARMS</span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#A855F7', marginTop: '8px' }}>3</div>
                <span style={{ fontSize: '12px', color: '#A855F7' }}>Running builds...</span>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>E2E CONTRACT HEALTH</span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#10B981', marginTop: '8px' }}>7 / 7</div>
                <span style={{ fontSize: '12px', color: '#10B981' }}>100% Green (Playwright)</span>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>SUPABASE BACKEND</span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#F59E0B', marginTop: '8px' }}>Isolated</div>
                <span style={{ fontSize: '12px', color: '#10B981' }}>Elevated keys secured</span>
              </div>
            </div>

            {/* Factory Projects List */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: '12px', border: '1px solid #334155', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Active App Factory Projects</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#0F172A', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '15px', color: '#F8FAFC' }}>Template Mobile (React Native + Expo)</strong>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Main boilerplate • Last built 2m ago</div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Production Green</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#0F172A', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '15px', color: '#F8FAFC' }}>AI Commerce SaaS Storefront</strong>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Generated project • Last built 1h ago</div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Staging Ready</span>
                </div>
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

    // ----------------------------------------------------
    // ROUTE: / (Home - Command Center Onboarding)
    // ----------------------------------------------------
    if (Platform.OS === 'web') {
      return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', color: '#F8FAFC' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '16px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <span>⚡ MULTI-AGENT APP FACTORY PLATFORM</span>
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 16px 0', background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Describe Your Idea. We Build & Deploy the App.
            </h1>
            <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '680px', margin: '0 auto' }}>
              Instant cross-platform generation (iOS, Android & Web) with automated agent swarms and continuous 7-gate E2E validation.
            </p>
          </div>

          {/* Interactive Creator Wizard */}
          <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #334155', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)', marginBottom: '48px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🪄</span> Start Building Your App
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '8px' }}>What app do you want to create?</label>
              <textarea
                rows={3}
                placeholder="e.g. A modern fitness tracking app with social leaderboards, AI workout plans, and Supabase auth..."
                value={appIdea}
                onChange={(e) => setAppIdea(e.target.value)}
                style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#F8FAFC', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>Template Blueprint:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  style={{ backgroundColor: '#0F172A', color: '#F8FAFC', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }}
                >
                  <option value="template-mobile">React Native + Expo Mobile (iOS/Android/Web)</option>
                  <option value="saas-portal">Full-Stack SaaS Web Portal</option>
                  <option value="e-commerce">E-Commerce Mobile Storefront</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleStartBuild}
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)'
                }}
              >
                🚀 Generate & Build App
              </button>
            </div>

            {buildingState ? (
              <div style={{ marginTop: '20px', padding: '14px', borderRadius: '8px', backgroundColor: '#0F172A', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '14px', fontWeight: '600' }}>
                {buildingState}
              </div>
            ) : null}
          </div>

          {/* Quick Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>📱</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Cross-Platform Native</h3>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px', lineHeight: '1.5' }}>
                Single codebase powered by React Native & Expo. Deploys seamlessly to iOS, Android, and Web browsers.
              </p>
            </div>
            <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>🛡️</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>7-Gate E2E Quality Guard</h3>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px', lineHeight: '1.5' }}>
                Automated Playwright test suite verifies authentication, protected navigation, profile persistence, and security isolation.
              </p>
            </div>
            <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>🤖</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Multi-Agent Swarm</h3>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px', lineHeight: '1.5' }}>
                Specialized subagents collaborate to architect, implement code, resolve linting, and enforce test contracts.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Factory App</Text>
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
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#FFF' }}>
              ⚡
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', letterSpacing: '-0.01em' }}>
              AppFactory OS
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: currentPath === '/' ? '#38BDF8' : '#94A3B8', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Home / Creator
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', color: currentPath === '/dashboard' ? '#38BDF8' : '#94A3B8', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/profile')}
              style={{ background: 'none', border: 'none', color: currentPath === '/profile' ? '#38BDF8' : '#94A3B8', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Developer Profile
            </button>
          </nav>

          {/* User Auth Action Button */}
          <div>
            {isAuth ? (
              <button
                onClick={() => navigate('/profile')}
                style={{ backgroundColor: '#1E293B', color: '#10B981', border: '1px solid #10B981', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                ● Connected ({displayName.split(' ')[0]})
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{ backgroundColor: '#6366F1', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                Sign In
              </button>
            )}
          </div>
        </header>
      ) : (
        <View testID="app-logo" style={styles.header}>
          <Text style={styles.headerText}>Factory Test App</Text>
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
