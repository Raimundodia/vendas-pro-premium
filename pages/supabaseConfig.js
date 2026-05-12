import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://fdbgqrdarclwusbcnzxa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYmdxcmRhcmNsd3VzYmNuenhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0NTY5NDMsImV4cCI6MjAzMTAzMjk0M30.yA_m7-E79S3S8-O88XF5I5N3F_U-D5M7V5-55555555'
);
