import { createBrowserClient } from "@supabase/ssr";
import { createLocalClient, isLocalMode } from "@/lib/local-store";
import { supabaseUrl, supabaseAnonKey } from "./config";

export function createClient() {
  if (isLocalMode()) {
    return createLocalClient() as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
