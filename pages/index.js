const [formProduto, setFormProduto] = useState({ name: '', sale_price: '', stock_quantity: '' });

const salvarProduto = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { error } = await supabase
      .from('products')
      .insert([{
        name: formProduto.name,
        sale_price: parseFloat(formProduto.sale_price),
        stock_quantity: parseFloat(formProduto.stock_quantity),
        user_id: (await supabase.auth.getUser()).data.user.id // Garante que o produto é teu
      }]);

    if (error) throw error;
    alert("✅ Produto salvo na nova estrutura!");
    setFormProduto({ name: '', sale_price: '', stock_quantity: '' });
    carregarDados();
  } catch (err) {
    alert("Erro ao salvar: " + err.message);
  }
  setLoading(false);
};
