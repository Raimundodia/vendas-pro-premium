import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from './supabaseconfig'; 
import Toast from 'react-native-toast-message';

export default function NewSaleScreen({ navigation }) {
  const [product, setProduct] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSale = async () => {
    if (!product || !value) return;
    setLoading(true);
    const { error } = await supabase.from('vendas').insert([{ produto: product, valor: parseFloat(value) }]);
    if (error) { Toast.show({ type: 'error', text1: 'Erro', text2: error.message }); }
    else { navigation.goBack(); }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Produto" value={product} onChangeText={setProduct} />
      <TextInput style={styles.input} placeholder="Valor" keyboardType="numeric" value={value} onChangeText={setValue} />
      <TouchableOpacity style={styles.button} onPress={handleSaveSale}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  input: { backgroundColor: '#1e1e2e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
