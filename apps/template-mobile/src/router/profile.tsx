import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import LoginScreen from './login';

export default function ProfileScreen() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [displayName, setDisplayName] = useState('Jane Doe');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = window.localStorage.getItem('auth');
      setIsAuth(auth === 'true');
      const savedName = window.localStorage.getItem('displayName');
      if (savedName) setDisplayName(savedName);
    }
  }, []);

  const handleSave = (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('displayName', displayName);
    }
    setStatusMessage('Profile updated');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth', 'false');
    }
    setIsAuth(false);
    router.push('/login');
  };

  if (!isAuth) {
    return <LoginScreen />;
  }

  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
        <h2>User Profile</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
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
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <TextInput
        name="displayName"
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Button testID="save-profile" title="Save Profile" onPress={handleSave} />
      {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
      <Button testID="logout" title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24 },
  input: { width: '80%', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, marginBottom: 12, paddingHorizontal: 8 },
  status: { color: 'green', marginVertical: 8 },
});
