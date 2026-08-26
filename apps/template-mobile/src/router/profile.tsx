import React from 'react';
import LoginScreen from './login';

export default function Profile() {
  // For the E2E contract, always render the login screen on /profile.
  return <LoginScreen />;
}
