import React from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth', 'false');
    }
    router.push('/login');
  };

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
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Button testID="logout" title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24 },
});
