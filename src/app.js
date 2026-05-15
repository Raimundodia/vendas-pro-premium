import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native'; // Importe View e StyleSheet

import LoginScreen from './loginscreen';
import RegisterScreen from './registerscreen';
import DashboardScreen from './dashboardscreen';
import NewSaleScreen from './newsalescreen';
import SalesHistoryScreen from './saleshistoryscreen';
import CustomersScreen from './customersscreen';
import ProductDetailScreen from './productdetailscreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}> 
      <View style={styles.container}> 
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="NewSale" component={NewSaleScreen} />
            <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} />
            <Stack.Screen name="Customers" component={CustomersScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a', // Garante que o fundo escuro apareça
  },
});
