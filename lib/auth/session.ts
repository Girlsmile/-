import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** AuthUser is the minimal user identity used by the application layer. */
export type AuthUser = {
  /** Stable Supabase user identifier. */
  id: string;
  /** Email address used for display and login. */
  email?: string;
};

/** getCurrentUser returns the current Supabase user or null when unauthenticated. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email
  };
}

/** requireUser redirects to login when no authenticated user is available. */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
