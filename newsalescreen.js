import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, FlatList, Alert
} from 'react-native';
import { supabase } from '../../config/supabaseConfig'; // Ajustado conforme sua estrutura

export default function NewSaleScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [saleType, setSaleType] = useState(null); // 'avista' ou 'fiado'
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    const { data: prod } = await supabase.from('products').select('*').gt('stock_quantity', 0);
    const { data: cust } = await supabase.from('customers').select('*');
    setProducts(prod || []);
    setCustomers(cust || []);
    setLoading(false);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const calculateTotal = () => cart.reduce((acc, item) => acc + (item.sale_price * item.qty), 0);

  const finalizarVenda = async () => {
    if (cart.length === 0) return Alert.alert("Erro", "Carrinho vazio");
    if (saleType === 'fiado' && !selectedCustomer) return Alert.alert("Erro", "Selecione um cliente");

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const total = calculateTotal();

      // 1. Registar a Venda
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          user_id: user.id,
          customer_id: selectedCustomer?.id || null,
          total_amount: total,
          final_amount: total,
          payment_method: saleType === 'fiado' ? 'fiado' : paymentMethod,
          status: 'completed'
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      // 2. Registar Itens e Baixar Estoque
      for (const item of cart) {
        await supabase.from('sale_items').insert([{
          sale_id: sale.id,
          product_id: item.id,
          quantity: item.qty,
          unit_price: item.sale_price,
          total_price: item.sale_price * item.qty
        }]);

        // Atualiza estoque
        await supabase.rpc('decrement_stock', { 
          row_id: item.id, 
          amount: item.qty 
        });
      }

      // 3. Se for Fiado, atualizar dívida do cliente
      if (saleType === 'fiado') {
        await supabase.from('customers')
          .update({ debt_balance: Number(selectedCustomer.debt_balance || 0) + total })
          .eq('id', selectedCustomer.id);
      }

      Alert.alert("Sucesso", "Venda realizada!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
    setLoading(false);
  };

  // Renderização simplificada para exemplo (mantenha seu estilo visual de UI)
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#7c3aed" />}
      
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Tipo de Venda</Text>
          <TouchableOpacity style={styles.btn} onPress={() => {setSaleType('avista'); setStep(2);}}>
            <Text style={styles.btnText}>À VISTA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => {setSaleType('fiado'); setStep(2);}}>
            <Text style={styles.btnText}>FIADO (ANOTAR)</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => addToCart(item)}>
              <Text style={styles.itemText}>{item.name} - R$ {item.sale_price}</Text>
              <Text style={styles.stockText}>Estoque: {item.stock_quantity}</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.btnNext} onPress={() => setStep(3)}>
              <Text style={styles.btnText}>Ver Carrinho ({cart.length})</Text>
            </TouchableOpacity>
          }
        />
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Total: R$ {calculateTotal().toFixed(2)}</Text>
          <TouchableOpacity style={styles.btnSuccess} onPress={finalizarVenda}>
            <Text style={styles.btnText}>CONCLUIR VENDA</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  stepContainer: { flex: 1, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  btn: { backgroundColor: '#1e1e3a', padding: 20, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#7c3aed' },
  btnSuccess: { backgroundColor: '#10b981', padding: 20, borderRadius: 12, marginTop: 20 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  item: { backgroundColor: '#111', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#7c3aed' },
  itemText: { color: '#fff', fontWeight: 'bold' },
  stockText: { color: '#666', fontSize: 12 },
  btnNext: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, marginTop: 10 }
});
