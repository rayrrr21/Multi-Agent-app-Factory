import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <View style={styles.container}>
      <View testID="app-logo" style={styles.header}>
        <Text style={styles.headerText}>Factory Test App</Text>
      </View>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});
