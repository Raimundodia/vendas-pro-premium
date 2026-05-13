import { supabase } from '../config/supabaseConfig';

// Serviço de API para operações CRUD com Supabase atualizado para Português
export const apiService = {
  
  // ==================== PRODUTOS ====================
  
  // Listar todos os produtos
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Obter um produto específico
  async getProduct(id) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Criar novo produto
  async createProduct(product) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert([{
          nome: product.nome,
          preco: product.preco,
          descricao: product.descricao,
          user_id: product.user_id
        }])
        .select();
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ==================== VENDAS ====================

  // Listar vendas
  async getSales(filters = {}) {
    try {
      let query = supabase
        .from('vendas')
        .select('*, customers(nome)')
        .order('criado_em', { ascending: false });

      if (filters.userId) query = query.eq('user_id', filters.userId);
      if (filters.customerId) query = query.eq('cliente_id', filters.customerId);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Criar nova venda com itens
  async createSale(saleData, cartItems) {
    try {
      // 1. Inserir na tabela principal de vendas
      const { data: sale, error: saleError } = await supabase
        .from('vendas')
        .insert([{
          cliente_id: saleData.cliente_id,
          valor_total: saleData.valor_total,
          metodo_pagamento: saleData.metodo_pagamento,
          status: 'pago',
          user_id: saleData.user_id
        }])
        .select();

      if (saleError) throw saleError;

      // 2. Inserir itens da venda (isso ativa o trigger de estoque automaticamente)
      const itemsToInsert = cartItems.map(item => ({
        venda_id: sale[0].id,
        produto_id: item.id,
        quantidade: item.quantidade,
        preco_unitario: item.preco
      }));

      const { error: itemsError } = await supabase
        .from('itens_venda')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      return { success: true, data: sale[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ==================== ESTATÍSTICAS ====================

  async getDashboardStats(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Vendas do dia
      const { data: todaySales, error: error1 } = await supabase
        .from('vendas')
        .select('valor_total')
        .eq('user_id', userId)
        .gte('criado_em', today);
      
      // Clientes
      const { data: customers, error: error2 } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', userId);
      
      // Produtos
      const { data: products, error: error3 } = await supabase
        .from('produtos')
        .select('id')
        .eq('user_id', userId);

      if (error1 || error2 || error3) throw (error1 || error2 || error3);

      const totalSales = todaySales.reduce((sum, sale) => sum + (sale.valor_total || 0), 0);

      return {
        success: true,
        data: {
          totalSales,
          totalCustomers: customers.length,
          totalProducts: products.length
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
