import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from './supabaseconfig'; 
import Toast from 'react-native-toast-message';

export default function NewSaleScreen({ navigation }) {
  const [valor, setValor] = useState('');

  const salvarVenda = async () => {
    const { error } = await supabase.from('vendas').insert([{ valor: parseFloat(valor) }]);
    if (error) Toast.show({ type: 'error', text1: 'Erro ao salvar' });
    else {
      Toast.show({ type: 'success', text1: 'Sucesso!' });
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Venda</Text>
      <TextInput style={styles.input} placeholder="Valor (R$)" placeholderTextColor="#666" keyboardType="numeric" value={valor} onChangeText={setValor} />
      <TouchableOpacity style={styles.button} onPress={salvarVenda}>
        <Text style={styles.buttonText}>Confirmar Venda</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, color: '#fff', marginBottom: 20 },
  input: { backgroundColor: '#1e1e2e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
