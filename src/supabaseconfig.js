import { createClient } from '@supabase/supabase-js';

// Substitua com as suas credenciais reais do projeto
const supabaseUrl = 'SUA_URL_AQUI'; 
const supabaseAnonKey = 'SUA_KEY_AQUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
