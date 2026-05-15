import { createClient } from '@supabase/supabase-client';

// Substitua pelas suas credenciais reais do Supabase
const supabaseUrl = 'SUA_URL_AQUI';
const supabaseAnonKey = 'SUA_CHAVE_AQUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
