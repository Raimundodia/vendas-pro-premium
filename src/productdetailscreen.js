import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, TextInput
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../config/supabaseConfig';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sincroniza os dados sempre que você volta para esta tela
  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Busca usando os novos nomes: sale_price e stock_quantity
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro de Conexão',
        text2: 'Não foi possível carregar os produtos',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  // Filtro de pesquisa inteligente
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stock de Produtos</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Procurar por nome..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{formatCurrency(item.sale_price)}</Text>
            </View>
            
            <View style={styles.stockBadge}>
              <Text style={styles.stockLabel}>STOCK</Text>
              <Text style={[
                styles.stockValue, 
                item.stock_quantity <= 5 ? { color: '#ef4444' } : { color: '#10b981' }
              ]}>
                {item.stock_quantity}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#161625' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center' },
  searchBar: { flex: 1, backgroundColor: '#1e1e3a', color: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2d2d5e' },
  card: { backgroundColor: '#1e1e3a', marginHorizontal: 20, marginTop: 12, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#2d2d5e' },
  productName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  productPrice: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  stockBadge: { alignItems: 'center', backgroundColor: '#161625', padding: 8, borderRadius: 8, minWidth: 60 },
  stockLabel: { color: '#94a3b8', fontSize: 8, fontWeight: 'bold' },
  stockValue: { fontSize: 16, fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#7c3aed', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  fabIcon: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  emptyText: { color: '#94a3b8', textAlign: 'center', marginTop: 40 }
});
