import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dmywnldsydixcfidoixx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRteXdubGRzeWRpeGNmaWRvaXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTM0MTYsImV4cCI6MjA5MzEyOTQxNn0.rjK1gSbuAVMwjfatLfksD_dAgSWmmDCDkE6E5ZvoTUA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storageKey: 'bluewaves-auth', storage: window.localStorage }
});
