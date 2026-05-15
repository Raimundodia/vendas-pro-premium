import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from './supabaseconfig'; 

export default function SalesHistoryScreen() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const { data, error } = await supabase.from('vendas').select('*').order('created_at', { ascending: false });
    if (!error) setSales(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <FlatList 
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.product}>{item.produto}</Text>
            <Text style={styles.value}>R$ {item.valor.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 50 },
  title: { fontSize: 24, color: '#fff', marginBottom: 20, fontWeight: 'bold' },
  item: { backgroundColor: '#1e1e2e', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  product: { color: '#fff', fontSize: 16 },
  value: { color: '#10b981', fontWeight: 'bold' }
});
