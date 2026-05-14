import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { authService } from '../../config/supabaseConfig';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validações básicas
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Preencha todos os campos.' });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'As passwords não coincidem.' });
      return;
    }

    setLoading(true);
    try {
      // Enviamos o nome para os metadados do utilizador no Supabase
      const result = await authService.signUp(email, password, { full_name: name });
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Conta Criada!',
          text2: 'Verifique o seu e-mail ou faça login.',
        });
        navigation.navigate('Login');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Falha no Registo',
        text2: error.message || 'Ocorreu um erro ao criar a conta.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar para o Login</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Criar Nova Conta</Text>
          <Text style={styles.subtitle}>Comece a gerir as suas vendas hoje</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>NOME COMPLETO</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João Silva"
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>E-MAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>CONFIRMAR PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita a password"
              placeholderTextColor="#555"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>CRIAR CONTA PROFISSIONAL</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 30 },
  backButton: { color: '#7c3aed', fontWeight: 'bold', marginBottom: 15 },
  title: { fontSize: 26, fontWeight: '800', color: '#f1f5f9' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  formContainer: { backgroundColor: '#1e1e3a', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#2d2d5e' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6 },
  input: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2d2d5e', borderRadius: 8, padding: 12, color: '#fff' },
  button: { backgroundColor: '#7c3aed', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
