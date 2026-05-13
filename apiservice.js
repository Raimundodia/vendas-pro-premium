  // Listar todos os produtos
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('produtos') // Alterado: de 'products' para 'produtos'
        .select('*')
        .order('nome', { ascending: true }); // Alterado: de 'name' para 'nome'
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
        .from('produtos') // Alterado
        .insert([{
          nome: product.name, // Mapeando o campo do app para o banco
          preco: product.price,
          descricao: product.description
        }])
        .select();
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
