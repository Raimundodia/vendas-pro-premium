import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, TextInput
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../config/supabaseConfig';

export default function CustomersScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Carrega sempre que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      loadCustomers();
    }, [])
  );

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Busca clientes usando debt_balance
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao carregar clientes',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
    setRefreshing(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  // Filtro de busca simples
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Clientes</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar cliente..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}
          >
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>{item.phone || 'Sem telefone'}</Text>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>SALDO DEVEDOR</Text>
              <Text style={[
                styles.balanceValue, 
                item.debt_balance > 0 ? { color: '#ef4444' } : { color: '#10b981' }
              ]}>
                {formatCurrency(item.debt_balance)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>Nenhum cliente encontrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  searchBar: { backgroundColor: '#1e1e3a', color: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2d2d5e' },
  card: { backgroundColor: '#1e1e3a', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  phone: { color: '#94a3b8', fontSize: 12 },
  balanceContainer: { alignItems: 'flex-end' },
  balanceLabel: { color: '#94a3b8', fontSize: 8, fontWeight: 'bold' },
  balanceValue: { fontSize: 14, fontWeight: 'bold' },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 50 }
});
