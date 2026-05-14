import { createClient } from '@supabase/supabase-js';

// Ajuste para Vercel: Usando NEXT_PUBLIC para as variáveis serem lidas no navegador
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Atenção: Variáveis do Supabase não configuradas no Vercel.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const authService = {
  // Login
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Obter usuário logado (Essencial para as políticas de segurança RLS)
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  async signOut() {
    await supabase.auth.signOut();
  }
};
