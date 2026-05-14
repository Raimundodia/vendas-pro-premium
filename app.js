import './globals.css'; // Importação dos estilos globais do Tailwind
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

// Configuração do Banco de Dados (Supabase)
import { supabase } from './src/config/supabaseConfig';

// Importação de todas as Telas do Sistema
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import NewSaleScreen from './src/screens/sales/NewSaleScreen';
import SalesHistoryScreen from './src/screens/sales/SalesHistoryScreen';
import CustomersScreen from './src/screens/customers/CustomersScreen';
import ProductsScreen from './src/screens/products/ProductsScreen';
import ProductDetailScreen from './src/screens/products/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Verifica se já existe uma sessão ativa ao abrir o app
    checkUser();

    // 2. Escuta mudanças de autenticação em tempo real (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.log("Erro de sessão:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Tela de carregamento enquanto o App verifica a segurança
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#0f0f1a' } // Cor de fundo padrão
        }}
      >
        {user ? (
          // --- ÁREA RESTRITA (SÓ ACESSA QUEM ESTÁ LOGADO) ---
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="NewSale" component={NewSaleScreen} />
            <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} />
            <Stack.Screen name="Customers" component={CustomersScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          </>
        ) : (
          // --- ÁREA PÚBLICA (LOGIN E CADASTRO) ---
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
      
      {/* Sistema de notificações global */}
      <Toast />
    </NavigationContainer>
  );
}
