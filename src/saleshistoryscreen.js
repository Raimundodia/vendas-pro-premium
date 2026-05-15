import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SalesHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Histórico de Vendas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, color: '#fff', fontWeight: 'bold' }
});
