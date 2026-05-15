import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// A LINHA ABAIXO É A QUE ESTÁ DANDO ERRO NO SEU BUILD. ESTA É A VERSÃO CERTA:
import { supabase } from './supabaseconfig'; 
import Toast from 'react-native-toast-message';

export default function NewSaleScreen({ navigation }) {
  const [product, setProduct] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSale = async () => {
    if (!product || !value) {
      Toast.show({ type: 'error', text1: 'Atenção', text2: 'Preencha o produto e o valor.' });
      return;
    }
    setLoading(true);
    
    const { error } = await supabase
      .from('vendas')
      .insert([{ produto: product, valor: parseFloat(value.replace(',', '.')) }]);

    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Venda registrada!' });
      navigation.goBack();
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Venda</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nome do Produto" 
        placeholderTextColor="#666" 
        value={product} 
        onChangeText={setProduct} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Valor (R$)" 
        placeholderTextColor="#666" 
        keyboardType="numeric" 
        value={value} 
        onChangeText={setValue} 
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveSale} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirmar Venda</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
        <Text style={{ color: '#666', textAlign: 'center' }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 50 },
  title: { fontSize: 24, color: '#fff', marginBottom: 20, fontWeight: 'bold' },
  input: { backgroundColor: '#1e1e2e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
