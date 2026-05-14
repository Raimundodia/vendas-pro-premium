import { supabase } from '../config/supabaseConfig';

export const apiService = {
  // ==================== PRODUTOS ====================
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async createProduct(product) {
    try {
      // Ajuste: Garantindo o uso de sale_price e stock_quantity
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ==================== CLIENTES ====================
  async getCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ==================== VENDAS ====================
  async createSale(saleData, items) {
    try {
      // 1. Insere a venda principal
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([saleData])
        .select()
        .single();
      
      if (saleError) throw saleError;

      // 2. Insere os itens da venda
      const saleItems = items.map(item => ({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.qty,
        unit_price: item.sale_price,
        total_price: item.qty * item.sale_price
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      return { success: true, data: sale };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ==================== DASHBOARD ====================
  async getDashboardStats(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Soma vendas de hoje
      const { data: todaySales } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('user_id', userId)
        .gte('created_at', today);
      
      // Conta clientes com dívida (Ajustado para debt_balance)
      const { data: debtCust } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', userId)
        .gt('debt_balance', 0);
      
      const { count: prodCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      return {
        success: true,
        data: {
          totalSales: todaySales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0,
          debtCustomers: debtCust?.length || 0,
          totalProducts: prodCount || 0
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
