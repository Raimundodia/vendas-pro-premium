import './globals.css'; 
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text } from 'react-native'; 
import Toast from 'react-native-toast-message';

import { supabase } from '../config/supabaseConfig'; // Adicionado ../

// Adicione ../ no início de todas as telas abaixo:
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import NewSaleScreen from '../screens/sales/NewSaleScreen';
import SalesHistoryScreen from '../screens/sales/SalesHistoryScreen';
import CustomersScreen from '../screens/customers/CustomersScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // ... resto do código do App igual ao anterior ...
}
