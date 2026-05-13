import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import Toast from 'react-native-toast-message';
import { apiService } from '../../services/apiService';
import { supabase } from '../../config/supabaseConfig';

export default function NewSaleScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [saleType, setSaleType] = useState('cash'); // Padrão: À Vista
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const prepare = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      loadData();
    };
    prepare();
  }, []);

  const loadData = async () => {
    const [pRes, cRes] = await Promise.all([
      apiService.getProducts(),
      apiService.getCustomers()
    ]);
    if (pRes.success) setProducts(pRes.data);
    if (cRes.success) setCustomers(cRes.data);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    Toast.show({ type: 'success', text1: 'Adicionado!', text2: `${product.name} no carrinho` });
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinalize = async () => {
    if (cart.length === 0) return Toast.show({ type: 'error', text1: 'Carrinho vazio' });
    if (saleType === 'credit' && !selectedCustomer) return Toast.show({ type: 'error', text1: 'Selecione um cliente para venda fiada' });

    setLoading(true);
    try {
      const saleData = {
        user_id: user.id,
        customer_id: selectedCustomer?.id || null,
        total_amount: calculateTotal(),
        type: saleType,
        status: 'completed'
      };

      const result = await apiService.createSale(saleData, cart);
      if (result.success) {
        Toast.show({ type: 'success', text1: 'Venda Concluída!', text2: 'Estoque e saldo atualizados.' });
        navigation.goBack();
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nova Venda</Text>
        <Text style={styles.stepIndicator}>Passo {step} de 2</Text>
      </View>

      {step === 1 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.searchBar}>
            <TextInput 
              placeholder="Buscar produto..." 
              placeholderTextColor="#64748b"
              style={styles.input}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <FlatList
            data={products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.productCard} onPress={() => addToCart(item)}>
                <View>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productStock}>Estoque: {item.stock}</Text>
                </View>
                <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>Total Parcial</Text>
              <Text style={styles.footerTotal}>R$ {calculateTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.nextBtn, cart.length === 0 && { opacity: 0.5 }]} 
              onPress={() => cart.length > 0 && setStep(2)}
            >
              <Text style={styles.nextBtnText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={styles.sectionTitle}>Tipo de Pagamento</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity 
              style={[styles.typeBtn, saleType === 'cash' && styles.typeBtnActive]} 
              onPress={() => setSaleType('cash')}
            >
              <Text style={styles.typeBtnText}>💵 À Vista</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeBtn, saleType === 'credit' && styles.typeBtnActive]} 
              onPress={() => setSaleType('credit')}
            >
              <Text style={styles.typeBtnText}>📝 Fiado</Text>
            </TouchableOpacity>
          </View>

          {saleType === 'credit' && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Selecionar Cliente</Text>
              {customers.map(c => (
                <TouchableOpacity 
                  key={c.id} 
                  style={[styles.customerItem, selectedCustomer?.id === c.id && styles.customerItemActive]}
                  onPress={() => setSelectedCustomer(c)}
                >
                  <Text style={{ color: '#fff' }}>{c.name}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}>Débito: R$ {c.balance}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.finalizeBtn} onPress={handleFinalize} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.finalizeBtnText}>Finalizar R$ {calculateTotal().toFixed(2)}</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setStep(1)} style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#94a3b8' }}>Voltar para itens</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  stepIndicator: { color: '#7c3aed', fontWeight: '600' },
  searchBar: { paddingHorizontal: 20, marginBottom: 10 },
  input: { backgroundColor: '#1e1e3a', borderRadius: 12, padding: 15, color: '#fff', borderWidth: 1, borderColor: '#2d2d5e' },
  productCard: { 
    backgroundColor: '#1e1e3a', padding: 18, borderRadius: 16, marginBottom: 12, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' 
  },
  productName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  productStock: { color: '#64748b', fontSize: 12 },
  productPrice: { color: '#10b981', fontWeight: '800', fontSize: 16 },
  footer: { 
    backgroundColor: '#1e1e3a', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: "#000", shadowOpacity: 0.5, shadowRadius: 10, elevation: 20
  },
  footerLabel: { color: '#94a3b8', fontSize: 12 },
  footerTotal: { color: '#fff', fontSize: 24, fontWeight: '800' },
  nextBtn: { backgroundColor: '#7c3aed', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12 },
  nextBtnText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: '700', marginBottom: 15, textTransform: 'uppercase' },
  typeContainer: { flexDirection: 'row', gap: 10 },
  typeBtn: { flex: 1, backgroundColor: '#1e1e3a', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  typeBtnActive: { borderColor: '#7c3aed', backgroundColor: '#2d2d5e' },
  typeBtnText: { color: '#fff', fontWeight: '700' },
  customerItem: { backgroundColor: '#1e1e3a', padding: 15, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  customerItemActive: { borderColor: '#7c3aed', borderWidth: 1 },
  finalizeBtn: { backgroundColor: '#10b981', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30 },
  finalizeBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});
