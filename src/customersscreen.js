import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Clientes</Text>
      <Text style={styles.text}>Módulo de gerenciamento de clientes em breve.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 10 },
  text: { color: '#666', textAlign: 'center' }
});
