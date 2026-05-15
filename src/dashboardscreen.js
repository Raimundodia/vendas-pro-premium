import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('NewSale')}>
        <Text style={styles.cardText}>🚀 Nova Venda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SalesHistory')}>
        <Text style={styles.cardText}>📊 Histórico</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Customers')}>
        <Text style={styles.cardText}>👥 Clientes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginBottom: 30 },
  card: { backgroundColor: '#1e1e2e', padding: 20, borderRadius: 15, marginBottom: 15 },
  cardText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
