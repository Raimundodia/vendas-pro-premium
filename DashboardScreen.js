import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { apiService } from '../../services/apiService';
import { supabase } from '../../config/supabaseConfig';

// --- COMPONENTE DE CARD MODERNO ---
const StatCard = ({ title, value, subtitle, color, icon }) => (
  <View style={[styles.modernCard, { borderLeftColor: color }]}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardIcon}>{icon}</Text>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
  </View>
);

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (user) loadDashboardData();
    }, [user])
  );

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsResult = await apiService.getDashboardStats(user.id);
      if (statsResult.success) setStats(statsResult.data);

      const salesResult = await apiService.getSales({ userId: user.id });
      if (salesResult.success) setRecentSales(salesResult.data.slice(0, 5));
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar dados' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); loadDashboardData();}} tintColor="#7c3aed" />}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Olá, Bem-vindo! 👋</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        </View>

        {/* SEÇÃO DE CARDS PREMIUM */}
        <View style={styles.statsGrid}>
          <StatCard 
            title="Vendas Hoje" 
            value={formatCurrency(stats?.totalSales)} 
            subtitle="Total acumulado"
            color="#10b981" 
            icon="💰"
          />
          <StatCard 
            title="Dívidas Ativas" 
            value={stats?.debtCustomers || 0} 
            subtitle="Clientes pendentes"
            color="#ef4444" 
            icon="⚠️"
          />
        </View>

        {/* BOTÃO DE AÇÃO RÁPIDA */}
        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('Sales', { screen: 'NewSale' })}
        >
          <View style={styles.quickActionIconContainer}>
            <Text style={styles.quickActionIcon}>+</Text>
          </View>
          <View>
            <Text style={styles.quickActionTitle}>Nova Venda</Text>
            <Text style={styles.quickActionSubtitle}>Registar agora um pedido</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vendas Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sales')}>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {recentSales.map((sale) => (
            <View key={sale.id} style={styles.saleItem}>
              <View style={styles.saleInfo}>
                <Text style={styles.saleType}>{sale.type === 'cash' ? 'À Vista' : 'Fiado'}</Text>
                <Text style={styles.saleDate}>{new Date(sale.created_at).toLocaleTimeString()}</Text>
              </View>
              <Text style={[styles.saleAmount, { color: sale.type === 'cash' ? '#10b981' : '#f59e0b' }]}>
                {formatCurrency(sale.total_amount)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' },
  scrollContent: { paddingBottom: 30 },
  header: { padding: 24, paddingTop: 60 },
  welcomeText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  dateText: { color: '#94a3b8', marginTop: 4, textTransform: 'capitalize' },
  statsGrid: { paddingHorizontal: 20, gap: 16 },
  
  // Estilo ModernCard
  modernCard: {
    backgroundColor: '#1e1e3a',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  cardIcon: { fontSize: 20 },
  cardValue: { color: '#fff', fontSize: 30, fontWeight: '800' },
  cardSubtitle: { color: '#64748b', fontSize: 12, marginTop: 4 },

  // Botão de ação
  quickActionCard: {
    margin: 20,
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quickActionIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quickActionIcon: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  quickActionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  quickActionSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  // Vendas
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
  sectionLink: { color: '#7c3aed', fontWeight: '600' },
  saleItem: {
    backgroundColor: '#16162e',
    padding: 16,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  saleType: { color: '#f1f5f9', fontWeight: '600' },
  saleDate: { color: '#64748b', fontSize: 11 },
  saleAmount: { fontWeight: '800', fontSize: 16 }
});
