import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/env";
import { supabaseSecretKey } from "@/lib/server-env";

let client: SupabaseClient | null = null;

/**
 * Privileged client that bypasses Row Level Security.
 * Only use on the server for validated, rate-limited operations.
 */
export function getServiceSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseSecretKey) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return client;
}
