// apps/template-mobile/src/router/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Public routes */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      {/* Protected routes */}
      <Stack.Screen name="home" options={{ title: 'Home', requiresAuth: true }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
