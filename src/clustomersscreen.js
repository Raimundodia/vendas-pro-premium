import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from './supabaseconfig'; 

export default function CustomersScreen() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from('clientes').select('*');
      if (!error) setCustomers(data);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Clientes</Text>
      {loading ? (
        <ActivityIndicator color="#7c3aed" />
      ) : (
        <FlatList 
          data={customers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 50 },
  title: { fontSize: 24, color: '#fff', marginBottom: 20, fontWeight: 'bold' },
  item: { backgroundColor: '#1e1e2e', padding: 15, borderRadius: 10, marginBottom: 10 },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  email: { color: '#666', fontSize: 14 }
});
