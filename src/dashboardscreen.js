import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from './supabaseconfig'; 

export default function DashboardScreen({ navigation }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Painel de Vendas</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('NewSale')}>
        <Text style={styles.cardText}>+ Nova Venda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 60 },
  header: { fontSize: 24, color: '#fff', marginBottom: 30 },
  card: { backgroundColor: '#7c3aed', padding: 20, borderRadius: 15, marginBottom: 20 },
  cardText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  logout: { marginTop: 40 },
  logoutText: { color: '#ef4444', textAlign: 'center' }
});
