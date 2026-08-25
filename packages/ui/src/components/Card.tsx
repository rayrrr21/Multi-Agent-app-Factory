// packages/ui/src/components/Card.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: any;
}

export const Card: React.FC<CardProps> = ({ title, children, style }) => (
  <View style={[styles.container, style]}>
    {title && <Text style={styles.title}>{title}</Text>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});
