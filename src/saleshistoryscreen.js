import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../config/supabaseConfig';

export default function SalesHistoryScreen({ navigation }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadSalesHistory();
    }, [])
  );

  const loadSalesHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Busca vendas trazendo o nome do cliente associado
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao carregar histórico',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Vendas</Text>
      </View>

      <FlatList
        data={sales}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadSalesHistory} tintColor="#7c3aed" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>{formatDate(item.created_at)}</Text>
              <View style={[
                styles.badge, 
                item.payment_method === 'fiado' ? styles.badgeFiado : styles.badgePago
              ]}>
                <Text style={styles.badgeText}>
                  {item.payment_method.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View>
                <Text style={styles.clientLabel}>CLIENTE</Text>
                <Text style={styles.clientName}>{item.customers?.name || 'Venda Avulsa'}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>{formatCurrency(item.total_amount)}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>Nenhuma venda registrada ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#161625' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  card: { backgroundColor: '#1e1e3a', marginHorizontal: 20, marginTop: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#2d2d5e' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#2d2d5e', paddingBottom: 8 },
  date: { color: '#94a3b8', fontSize: 11 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgePago: { backgroundColor: '#10b98120', borderColor: '#10b981', borderWidth: 1 },
  badgeFiado: { backgroundColor: '#ef444420', borderColor: '#ef4444', borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#fff' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  clientLabel: { color: '#94a3b8', fontSize: 9, fontWeight: 'bold' },
  clientName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  priceContainer: { alignItems: 'flex-end' },
  totalLabel: { color: '#94a3b8', fontSize: 9, fontWeight: 'bold' },
  totalValue: { color: '#7c3aed', fontSize: 18, fontWeight: 'bold' },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 50 }
});
