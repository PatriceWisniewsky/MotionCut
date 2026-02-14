import { createBrowserClient } from "@supabase/ssr";
import { createLocalClient, isLocalMode } from "@/lib/local-store";

export function createClient() {
  if (isLocalMode()) {
    return createLocalClient() as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
