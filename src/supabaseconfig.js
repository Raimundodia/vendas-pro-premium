import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseAnonKey = 'sua-chave-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
