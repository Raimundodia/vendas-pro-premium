import React, { useEffect, useState, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

// Configuração do Supabase
import { supabase } from './src/config/supabaseConfig';

// Importação das Telas (Ajustadas conforme os arquivos que revisamos)
import LoginScreen from './src/screens/auth/LoginScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import NewSaleScreen from './src/screens/sales/NewSaleScreen';
// Nota: Certifique-se que estas telas abaixo existem ou use as que implementamos
// import ProductsScreen from './src/screens/products/ProductsScreen';
// import CustomersScreen from './src/screens/customers/CustomersScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Verifica sessão inicial
    checkUser();

    // 2. Escuta mudanças na autenticação (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Rotas para Utilizador Logado
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="NewSale" component={NewSaleScreen} />
            {/* Adicione aqui outras telas conforme as for criando */}
          </>
        ) : (
          // Rotas para Utilizador Não Logado
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
