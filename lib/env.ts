/** SupabaseConfig contains public project values used by Supabase clients. */
export type SupabaseConfig = {
  /** Supabase project URL. */
  url: string;
  /** Supabase anonymous key for browser and SSR auth calls. */
  anonKey: string;
};

/** getSupabaseConfig reads required Supabase public environment variables. */
export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return { url, anonKey };
}
