import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { apiService } from '../../services/apiService';
import { supabase } from '../../config/supabaseConfig';

export default function NewSaleScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
    loadProducts();
    loadCustomers();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadProducts = async () => {
    const result = await apiService.getProducts();
    if (result.success) {
      setProducts(result.data);
    }
  };

  const loadCustomers = async () => {
    // Se a função no apiService ainda for getCustomers, mantemos
    const result = await apiService.getCustomers();
    if (result.success) {
      setCustomers(result.data);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantidade: item.quantidade + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantidade: 1 }]);
    }
    Toast.show({ type: 'success', text1: 'Adicionado', text2: `${product.nome} no carrinho` });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  };

  const handleFinishSale = async () => {
    if (!paymentMethod) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Selecione um método de pagamento' });
      return;
    }

    setLoading(true);
    const saleData = {
      cliente_id: selectedCustomer?.id || null,
      valor_total: calculateTotal(),
      metodo_pagamento: paymentMethod,
      user_id: user.id
    };

    const result = await apiService.createSale(saleData, cart);
    setLoading(false);

    if (result.success) {
      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Venda realizada com sucesso!' });
      navigation.navigate('Sales');
    } else {
      Toast.show({ type: 'error', text1: 'Erro', text2: result.error });
    }
  };

  // Renderização do Item do Carrinho (Ajustado para Português)
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.nome}</Text>
        <Text style={styles.cartItemPrice}>R$ {item.preco.toFixed(2)} x {item.quantidade}</Text>
      </View>
      <Text style={styles.qtyText}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Lógica de navegação entre Step 1 (Produtos) e Step 2 (Pagamento) */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nova Venda</Text>
        
        {step === 1 ? (
          <View>
            <Text style={styles.label}>Selecionar Produtos</Text>
            {products.map(product => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard} 
                onPress={() => addToCart(product)}
              >
                <Text style={styles.productName}>{product.nome}</Text>
                <Text style={styles.productPrice}>R$ {product.preco.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
              <Text style={styles.nextBtnText}>Continuar (R$ {calculateTotal().toFixed(2)})</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Método de Pagamento</Text>
            <View style={styles.paymentContainer}>
              {['Pix', 'Dinheiro', 'Cartão'].map(method => (
                <TouchableOpacity 
                  key={method}
                  style={[styles.paymentBtn, paymentMethod === method && styles.paymentBtnActive]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text style={styles.paymentBtnText}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={item => item.id.toString()}
              style={{ marginVertical: 20 }}
            />

            <TouchableOpacity 
              style={styles.finishBtn} 
              onPress={handleFinishSale}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.finishBtnText}>Finalizar Venda</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 20 },
  label: { color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', fontSize: 12 },
  productCard: { backgroundColor: '#1e1e3a', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#2d2d5e' },
  productName: { color: '#fff', fontWeight: '700' },
  productPrice: { color: '#10b981', marginTop: 5 },
  nextBtn: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  nextBtnText: { color: '#fff', fontWeight: '700' },
  paymentContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  paymentBtn: { flex: 1, padding: 12, backgroundColor: '#1e1e3a', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#2d2d5e' },
  paymentBtnActive: { borderColor: '#7c3aed', backgroundColor: '#252545' },
  paymentBtnText: { color: '#fff', fontSize: 12 },
  finishBtn: { backgroundColor: '#10b981', padding: 18, borderRadius: 12, alignItems: 'center' },
  finishBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#1a1a2e', marginBottom: 5, borderRadius: 8 },
  cartItemName: { color: '#fff', fontWeight: '600' },
  cartItemPrice: { color: '#94a3b8', fontSize: 11 }
});
