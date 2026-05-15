import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from './supabaseconfig'; 

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params || {};

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{product?.nome || 'Produto'}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Preço de Venda:</Text>
        <Text style={styles.price}>R$ {product?.preco?.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 50 },
  back: { color: '#7c3aed', marginBottom: 20 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
  infoBox: { backgroundColor: '#1e1e2e', padding: 20, borderRadius: 15 },
  label: { color: '#666', fontSize: 14 },
  price: { color: '#10b981', fontSize: 24, fontWeight: 'bold', marginTop: 5 }
});
