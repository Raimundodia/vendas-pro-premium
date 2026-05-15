import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
// Caminho corrigido para a mesma pasta
import { supabase } from './supabaseconfig'; 
import Toast from 'react-native-toast-message';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Preencha todos os campos' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Toast.show({ type: 'error', text1: 'Erro', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Conta criada com sucesso.' });
      navigation.navigate('Login');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Conta</Text>
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#666" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#666" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Já tenho conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, color: '#fff', textAlign: 'center', marginBottom: 30, fontWeight: 'bold' },
  input: { backgroundColor: '#1e1e2e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#10b981', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#666', textAlign: 'center', marginTop: 20 }
});
