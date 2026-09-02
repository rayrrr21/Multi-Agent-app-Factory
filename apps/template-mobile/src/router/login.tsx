import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth', 'true');
    }
    router.push('/profile');
  };

  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', padding: '16px' }}>
        <form data-testid="login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
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
    <View style={styles.container} testID="login-form">
      <Text style={styles.title}>Login</Text>
      <TextInput
        testID="email-input"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        testID="password-input"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button testID="login-submit-btn" title="Log In" onPress={() => handleLogin()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24 },
  input: { width: '80%', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, marginBottom: 12, paddingHorizontal: 8 },
});
