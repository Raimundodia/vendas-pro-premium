import { createClient } from '@supabase/supabase-js';

// Verifique se as suas chaves estão corretas aqui
const supabaseUrl = 'SUA_URL_AQUI'; 
const supabaseAnonKey = 'SUA_KEY_AQUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
