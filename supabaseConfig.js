import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'SUA_URL_AQUI';
const supabaseAnonKey = 'SUA_CHAVE_ANON_AQUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
