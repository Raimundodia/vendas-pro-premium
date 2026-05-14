import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../config/supabaseConfig';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ totalSales: 0, debtCustomers: 0, totalProducts: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Recarrega os dados sempre que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Buscar Total de Vendas de Hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: salesToday } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('user_id', user.id)
        .gte('created_at', today);
      
      const totalSales = salesToday?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0;

      // 2. Buscar Clientes com Dívida (balance > 0)
      const { count: debtCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('balance', 0);

      // 3. Buscar Total de Produtos
      const { count: prodCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setStats({
        totalSales,
        debtCustomers: debtCount || 0,
        totalProducts: prodCount || 0
      });

      // 4. Buscar Vendas Recentes
      const { data: latestSales } = await supabase
        .from('sales')
        .select('*, customers(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentSales(latestSales || []);
    } catch (error) {
      console.error("Erro no Dashboard:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Painel Geral 👋</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR')}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
          <Text style={styles.statLabel}>VENDAS HOJE</Text>
          <Text style={styles.statValue}>{formatCurrency(stats.totalSales)}</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
          <Text style={styles.statLabel}>EM DÉBITO</Text>
          <Text style={styles.statValue}>{stats.debtCustomers}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('NewSale')}>
        <Text style={styles.mainButtonText}>➕ NOVA VENDA</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VENDAS RECENTES</Text>
        {recentSales.map((sale) => (
          <View key={sale.id} style={styles.saleItem}>
            <View>
              <Text style={styles.saleType}>{sale.type === 'vista' ? '💵 À Vista' : '📒 Fiado'}</Text>
              <Text style={styles.saleCustomer}>{sale.customers?.name || 'Cliente Avulso'}</Text>
            </View>
            <Text style={styles.saleValue}>{formatCurrency(sale.total_amount)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 40 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  date: { color: '#94a3b8', fontSize: 14 },
  statsGrid: { flexDirection: 'row', padding: 20, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#1e1e3a', padding: 15, borderRadius: 12, borderLeftWidth: 4 },
  statLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  mainButton: { margin: 20, backgroundColor: '#7c3aed', padding: 20, borderRadius: 15, alignItems: 'center' },
  mainButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  section: { padding: 20 },
  sectionTitle: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 15 },
  saleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e3a', padding: 15, borderRadius: 10, marginBottom: 8 },
  saleType: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  saleCustomer: { color: '#94a3b8', fontSize: 12 },
  saleValue: { color: '#10b981', fontWeight: 'bold' }
});
