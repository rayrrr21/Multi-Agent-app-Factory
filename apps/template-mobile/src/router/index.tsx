import React from 'react';
import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text testID="app-logo" style={{ fontSize: 24 }}>Factory Test App</Text>
    </View>
  );
}
