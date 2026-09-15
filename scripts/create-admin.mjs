#!/usr/bin/env node
/**
 * Creates (or updates) an admin account.
 *
 *   npm run create-admin -- you@example.com "StrongPassword123" "Your Name" owner
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY from .env.local (or the environment).
 * Roles: owner | admin | editor (default: owner for the first admin).
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(file) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match || line.trim().startsWith("#")) continue;
    const [, key, raw] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = raw.replace(/^(['"])(.*)\1$/, "$2");
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const [email, password, displayName = "", role = "owner"] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!email || !password) {
  fail('Usage: npm run create-admin -- you@example.com "StrongPassword123" "Your Name" owner');
}
if (password.length < 10) fail("Password must be at least 10 characters.");
if (!["owner", "admin", "editor"].includes(role)) fail("Role must be owner, admin or editor.");
if (!url || !secret) fail("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.");

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUserByEmail(target) {
  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === target);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
  return null;
}

const normalizedEmail = email.trim().toLowerCase();

try {
  let user = await findUserByEmail(normalizedEmail);

  if (user) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    if (error) throw error;
    console.log(`• Existing user found — password updated for ${normalizedEmail}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
    console.log(`• Created auth user ${normalizedEmail}`);
  }

  const { error: upsertError } = await supabase
    .from("admin_users")
    .upsert({ user_id: user.id, email: normalizedEmail, display_name: displayName || null, role }, { onConflict: "user_id" });
  if (upsertError) throw upsertError;

  console.log(`✔ ${normalizedEmail} can now sign in at /admin/login (role: ${role})\n`);
} catch (error) {
  fail(error?.message ?? String(error));
}
