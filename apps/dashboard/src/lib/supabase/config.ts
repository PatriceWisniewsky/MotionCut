/**
 * Supabase Konfiguration mit Fallback-Werten.
 * Der anon key ist ein öffentlicher Key (wie in Supabase Docs beschrieben),
 * daher ist ein Fallback hier sicher. RLS schützt die Daten serverseitig.
 */

const FALLBACK_SUPABASE_URL = "https://vcjkssrwrqwaprxnngai.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjamtzc3J3cnF3YXByeG5uZ2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDYwOTEsImV4cCI6MjA4NjY4MjA5MX0.OMLkApp_x-51srmUMxVtu-NBSqXkWkwsOCd0wvF8sLA";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
