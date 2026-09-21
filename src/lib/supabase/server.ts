import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "@/lib/env";

/** The `Authorization: Bearer …` access token sent by the admin app, if there is one. */
export async function getBearerToken(): Promise<string | null> {
  const header = (await headers()).get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  return scheme?.toLowerCase() === "bearer" && token ? token : null;
}

/** Supabase client that acts as the holder of an access token instead of a cookie session. */
export function createSupabaseTokenClient(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

/** Anonymous client for sign-in and token refresh, which have no session yet. */
export function createSupabaseAnonClient(): SupabaseClient {
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/** Supabase client bound to the signed-in admin's session cookies, or to a bearer token. */
export async function createSupabaseServerClient() {
  const token = await getBearerToken();
  if (token) return createSupabaseTokenClient(token);

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — the proxy keeps the session fresh instead.
        }
      },
    },
  });
}
