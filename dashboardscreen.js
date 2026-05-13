import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiService } from '../../services/apiService';
import { supabase } from '../../config/supabaseConfig';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ totalSales: 0, totalCustomers: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (user) loadDashboardData();
    }, [user])
  );

  const loadDashboardData = async () => {
    setLoading(true);
    const result = await apiService.getDashboardStats(user.id);
    if (result.success) setStats(result.data);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel de Gestão</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Vendas Hoje</Text>
          <Text style={styles.statValue}>R$ {stats.totalSales.toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Produtos</Text>
          <Text style={styles.statValue}>{stats.totalProducts}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.mainButton}
        onPress={() => navigation.navigate('NewSale')}
      >
        <Text style={styles.mainButtonText}>+ Nova Venda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  header: { marginBottom: 30, marginTop: 40 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: '#1e1e3a', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#2d2d5e' },
  statLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 5 },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  mainButton: { backgroundColor: '#7c3aed', padding: 20, borderRadius: 15, alignItems: 'center' },
  mainButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});
