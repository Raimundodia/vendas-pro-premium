import { createClient } from '@supabase/supabase-client';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'SUA_URL_AQUI';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'SUA_CHAVE_AQUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
