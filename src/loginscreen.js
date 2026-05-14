import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { authService } from '../../config/supabaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Campos Obrigatórios',
        text2: 'Por favor, preencha e-mail e senha',
      });
      return;
    }

    setLoading(true);
    // Ajuste: Chamada padronizada com o nosso supabaseConfig.js
    const result = await authService.signIn(email, password);
    setLoading(false);

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Bem-vindo!',
        text2: 'Acesso autorizado com sucesso.',
      });
      // A navegação geralmente é resetada no App.js ao detectar a sessão
    } else {
      Toast.show({
        type: 'error',
        text1: 'Falha no Acesso',
        text2: result.error || 'Verifique suas credenciais.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>📦</Text>
          <Text style={styles.title}>VendasPRO</Text>
          <Text style={styles.subtitle}>Gestão Inteligente de Estoque</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Entrar na sua conta</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>E-mail</Text>
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
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ACESSAR SISTEMA</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#f1f5f9' },
  subtitle: { fontSize: 14, color: '#94a3b8' },
  formContainer: { backgroundColor: '#1e1e3a', borderRadius: 16, padding: 24, borderSize: 1, borderColor: '#2d2d5e' },
  formTitle: { fontSize: 20, fontWeight: '700', color: '#f1f5f9', marginBottom: 24 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2d2d5e', borderRadius: 8, padding: 12, color: '#fff' },
  button: { backgroundColor: '#7c3aed', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
