// ... importações mantidas ...
// IMPORTANTE: Adicionei a lógica de baixa automática no estoque

const handleFinalizeSale = async () => {
  setLoading(true);
  try {
    const user = await authService.getCurrentUser();
    
    // 1. Criar a Venda
    const { data: sale, error: saleErr } = await supabase
      .from('sales')
      .insert([{
        user_id: user.id,
        type: saleType,
        customer_id: selectedCustomer?.id || null,
        payment_method: paymentMethod,
        total_amount: getTotal(),
        status: 'completed'
      }])
      .select().single();

    if (saleErr) throw saleErr;

    // 2. Registrar Itens e Baixar Estoque
    for (const item of cart) {
      await supabase.from('sale_items').insert({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.sale_price,
        total_price: item.sale_price * item.quantity
      });

      // Baixa automática no estoque
      const { data: prod } = await supabase.from('products').select('stock_qty').eq('id', item.id).single();
      await supabase.from('products').update({ stock_qty: prod.stock_qty - item.quantity }).eq('id', item.id);
    }

    // 3. Se for fiado, atualiza o saldo do cliente
    if (saleType === 'fiado' && selectedCustomer) {
      const { data: cust } = await supabase.from('customers').select('balance').eq('id', selectedCustomer.id).single();
      await supabase.from('customers').update({ balance: (cust.balance || 0) + getTotal() }).eq('id', selectedCustomer.id);
    }

    alert("Venda realizada com sucesso!");
    navigation.goBack();
  } catch (error) {
    alert("Erro: " + error.message);
  } finally {
    setLoading(false);
  }
};
