import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/env";

/** createBrowserSupabaseClient creates a Supabase client for client components. */
export function createBrowserSupabaseClient() {
  const config = getSupabaseConfig();
  return createBrowserClient(config.url, config.anonKey);
}
