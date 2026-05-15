import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProductDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Detalhes do Produto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, color: '#fff', fontWeight: 'bold' }
});
