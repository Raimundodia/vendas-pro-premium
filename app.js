import React, { useEffect, useReducer } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from './src/config/supabaseConfig';

// Importação das Telas (Verifique se os caminhos estão corretos)
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import SalesScreen from './src/screens/sales/SalesScreen';
import NewSaleScreen from './src/screens/sales/NewSaleScreen';
import CustomersScreen from './src/screens/customers/CustomersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  useEffect(() => {
    // Verificar sessão ativa ao abrir o app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserToken(session?.access_token ?? null);
      setIsLoading(false);
    });

    // Ouvir mudanças na autenticação (Login/Logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      setUserToken(session?.access_token ?? null);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0f0f1a' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          // Fluxo de Autenticação
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        ) : (
          // Fluxo Principal da App
          <Stack.Screen name="Main" component={DashboardScreen} /> 
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
