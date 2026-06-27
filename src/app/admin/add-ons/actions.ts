"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, createClient } from "@/lib/supabase/server";

type AddOnPayload = {
  name: string;
  price: number;
};

function validateAddOn(payload: AddOnPayload) {
  if (!payload.name) return "Name is required.";
  if (Number.isNaN(payload.price) || payload.price < 0) {
    return "Price must be zero or greater.";
  }
  return null;
}

async function revalidateMenu() {
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/add-ons");
}

export async function createAddOn(payload: AddOnPayload) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const validationError = validateAddOn(payload);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("add_ons").insert({
    name: payload.name,
    price: payload.price,
  });

  if (error) return { error: error.message };

  await revalidateMenu();
  return { success: true };
}

export async function updateAddOn(id: string, payload: AddOnPayload) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const validationError = validateAddOn(payload);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("add_ons")
    .update({
      name: payload.name,
      price: payload.price,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await revalidateMenu();
  return { success: true };
}

export async function deleteAddOn(id: string) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("add_ons").delete().eq("id", id);

  if (error) return { error: error.message };

  await revalidateMenu();
  return { success: true };
}
