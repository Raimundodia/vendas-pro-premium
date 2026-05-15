import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { supabase } from './supabaseconfig'; 

export default function DashboardScreen({ navigation }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('NewSale')}>
        <Text style={styles.cardText}>+ Nova Venda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardSecondary} onPress={() => navigation.navigate('SalesHistory')}>
        <Text style={styles.cardText}>Ver Histórico</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 60 },
  header: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginBottom: 30 },
  card: { backgroundColor: '#7c3aed', padding: 25, borderRadius: 15, marginBottom: 15 },
  cardSecondary: { backgroundColor: '#1e1e2e', padding: 25, borderRadius: 15, marginBottom: 15 },
  cardText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  logout: { marginTop: 40, padding: 20 },
  logoutText: { color: '#ef4444', textAlign: 'center' }
});
