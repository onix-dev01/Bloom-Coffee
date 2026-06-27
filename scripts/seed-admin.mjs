/**
 * Creates the seed admin user in Supabase Auth and promotes the profile to admin.
 *
 * Loads .env then .env.local from the project root (same vars as the Next.js app).
 *
 * Default credentials (document in README):
 *   admin@bloomcoffee.com / BloomAdmin123!
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filename) {
  const path = resolve(root, filename);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = "admin@bloomcoffee.com";
const ADMIN_PASSWORD = "BloomAdmin123!";

if (!url || !serviceRoleKey) {
  const missing = [
    !url && "NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)",
    !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
  ].filter(Boolean);

  console.error(`Missing in .env / .env.local: ${missing.join(", ")}.`);
  console.error(
    "Add SUPABASE_SERVICE_ROLE_KEY from Supabase → Project Settings → API → service_role.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existingUsers } = await supabase.auth.admin.listUsers();
const existing = existingUsers?.users?.find((u) => u.email === ADMIN_EMAIL);

let userId = existing?.id;

if (!userId) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }

  userId = data.user.id;
  console.log("Created admin user:", ADMIN_EMAIL);
} else {
  console.log("Admin user already exists:", ADMIN_EMAIL);
}

const { error: profileError } = await supabase
  .from("profiles")
  .update({ role: "admin" })
  .eq("id", userId);

if (profileError) {
  console.error("Failed to promote profile to admin:", profileError.message);
  process.exit(1);
}

console.log("Admin profile ready. Login with:");
console.log(`  Email:    ${ADMIN_EMAIL}`);
console.log(`  Password: ${ADMIN_PASSWORD}`);
