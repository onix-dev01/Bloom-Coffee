/**
 * Creates the seed admin user in Supabase Auth and promotes the profile to admin.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-admin.mjs
 *
 * Default credentials (document in README):
 *   admin@bloomcoffee.com / BloomAdmin123!
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = "admin@bloomcoffee.com";
const ADMIN_PASSWORD = "BloomAdmin123!";

if (!url || !serviceRoleKey) {
  console.error(
    "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
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
