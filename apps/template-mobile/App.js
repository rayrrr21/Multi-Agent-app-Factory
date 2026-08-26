import React from 'react';
import { registerRootComponent } from "expo";
import { View, Text } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text testID="app-logo" style={{ fontSize: 24 }}>Factory Test App</Text>
    </View>
  );
}

registerRootComponent(App);
