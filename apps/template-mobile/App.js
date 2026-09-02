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

  // Sync route path and auth state with browser window location & localStorage
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

  // Render Web-optimized views for web environment (Playwright)
  const renderContent = () => {
    if (currentPath === '/login') {
      if (Platform.OS === 'web') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
            <form data-testid="login-form" onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
              <h2 style={{ textAlign: 'center' }}>Login</h2>
              <input
                data-testid="email-input"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: '12px', padding: '8px', fontSize: '16px' }}
              />
              <input
                data-testid="password-input"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: '12px', padding: '8px', fontSize: '16px' }}
              />
              <button type="submit" data-testid="login-submit-btn" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
                Log In
              </button>
            </form>
          </div>
        );
      }
      return (
        <View style={styles.content} testID="login-form">
          <Text style={styles.title}>Login</Text>
          <TextInput testID="email-input" style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput testID="password-input" style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <Button testID="login-submit-btn" title="Log In" onPress={handleLoginSubmit} />
        </View>
      );
    }

    if (currentPath === '/profile') {
      if (!isAuth) {
        // Redirect/render login form when unauthenticated
        return renderContentForPath('/login');
      }

      if (Platform.OS === 'web') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
            <h2>User Profile</h2>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
              <label style={{ marginBottom: '4px' }}>Display Name:</label>
              <input
                name="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ marginBottom: '12px', padding: '8px', fontSize: '16px' }}
              />
              <button type="submit" data-testid="save-profile" style={{ padding: '10px', marginBottom: '12px', fontSize: '16px' }}>
                Save Profile
              </button>
            </form>
            {statusMessage ? <p style={{ color: 'green' }}>{statusMessage}</p> : null}
            <button
              type="button"
              data-testid="logout"
              onClick={handleLogout}
              style={{ padding: '10px', fontSize: '16px', marginTop: '16px', width: '300px' }}
            >
              Log Out
            </button>
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

    if (currentPath === '/dashboard') {
      if (Platform.OS === 'web') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
            <h2>Dashboard</h2>
            <button
              type="button"
              data-testid="logout"
              onClick={handleLogout}
              style={{ padding: '10px', fontSize: '16px', marginTop: '16px' }}
            >
              Log Out
            </button>
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

    // Default / Home route
    return (
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Factory App</Text>
      </View>
    );
  };

  const renderContentForPath = (path) => {
    if (path === '/login') {
      if (Platform.OS === 'web') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
            <form data-testid="login-form" onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
              <h2 style={{ textAlign: 'center' }}>Login</h2>
              <input
                data-testid="email-input"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: '12px', padding: '8px', fontSize: '16px' }}
              />
              <input
                data-testid="password-input"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: '12px', padding: '8px', fontSize: '16px' }}
              />
              <button type="submit" data-testid="login-submit-btn" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
                Log In
              </button>
            </form>
          </div>
        );
      }
      return (
        <View style={styles.content} testID="login-form">
          <Text style={styles.title}>Login</Text>
          <TextInput testID="email-input" style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput testID="password-input" style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <Button testID="login-submit-btn" title="Log In" onPress={handleLoginSubmit} />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View testID="app-logo" style={styles.header}>
        <Text style={styles.headerText}>Factory Test App</Text>
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, backgroundColor: '#f0f0f0', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd' },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24 },
  input: { width: '80%', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, marginBottom: 12, paddingHorizontal: 8 },
  status: { color: 'green', marginVertical: 8 },
});

registerRootComponent(App);
