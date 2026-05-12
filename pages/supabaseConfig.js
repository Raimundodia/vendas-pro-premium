import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fdbgqrdarclwusbcnzxa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYmdxcmRhcmNsd3VzYmNuenhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0NTY5NDMsImV4cCI6MjAzMTAzMjk0M30.yA_m7-E79S3S8-O88XF5I5N3F_U-D5M7V5-55555555';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
