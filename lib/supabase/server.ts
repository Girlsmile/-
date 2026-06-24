import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/env";

/** createServerSupabaseClient creates a cookie-aware Supabase client for SSR. */
export async function createServerSupabaseClient() {
  const config = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      /** getAll exposes request cookies to Supabase session handling. */
      getAll() {
        return cookieStore.getAll();
      },
      /** setAll persists refreshed auth cookies when the caller allows writes. */
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies; Server Actions can.
        }
      }
    }
  });
}
