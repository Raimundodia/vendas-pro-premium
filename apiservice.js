  // Listar todos os produtos
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('produtos') // Alterado aqui
        .select('*')
        .order('nome', { ascending: true }); // Alterado aqui
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
