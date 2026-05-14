import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import Toast from 'react-native-toast-message';
import { apiService } from '../../services/apiService';
import { supabase } from '../../config/supabaseConfig';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductData();
  }, []);

  const loadProductData = async () => {
    setLoading(true);
    try {
      // Busca usando os novos nomes de coluna
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao carregar o produto',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Produto</Text>
      </View>

      {product && (
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.label}>NOME DO PRODUTO</Text>
            <Text style={styles.value}>{product.name}</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.card, { flex: 1 }]}>
              <Text style={styles.label}>PREÇO DE VENDA</Text>
              <Text style={[styles.value, { color: '#10b981' }]}>
                {formatCurrency(product.sale_price)}
              </Text>
            </View>

            <View style={[styles.card, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>STOCK ATUAL</Text>
              <Text style={[
                styles.value, 
                product.stock_quantity <= 5 ? { color: '#f59e0b' } : { color: '#fff' }
              ]}>
                {product.stock_quantity} un
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => alert("Função de editar em desenvolvimento")}
          >
            <Text style={styles.buttonText}>EDITAR PRODUTO</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  backBtn: { color: '#7c3aed', marginRight: 20, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { padding: 20 },
  card: { backgroundColor: '#1e1e3a', padding: 20, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#2d2d5e' },
  row: { flexDirection: 'row' },
  label: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  value: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  editButton: { backgroundColor: '#334155', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
