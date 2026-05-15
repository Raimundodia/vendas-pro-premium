import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from './supabaseconfig'; 

export default function NewSaleScreen({ navigation }) {
  const [product, setProduct] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSale = async () => {
    if (!product || !value) {
      alert('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('vendas')
        .insert([{ 
          produto: product, 
          valor: parseFloat(value.replace(',', '.')) 
        }]);

      if (error) throw error;

      alert('Venda registrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginBottom: 30 },
  input: { backgroundColor: '#1e1e2e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelText: { color: '#666', textAlign: 'center' }
});
