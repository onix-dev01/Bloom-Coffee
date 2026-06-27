"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, createClient } from "@/lib/supabase/server";

type DrinkPayload = {
  name: string;
  description: string;
  basePrice: number;
};

function validateDrink(payload: DrinkPayload) {
  if (!payload.name) return "Name is required.";
  if (!payload.description) return "Description is required.";
  if (Number.isNaN(payload.basePrice) || payload.basePrice < 0) {
    return "Base price must be zero or greater.";
  }
  return null;
}

async function revalidateMenu() {
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/drinks");
}

export async function createDrink(payload: DrinkPayload) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const validationError = validateDrink(payload);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("drinks").insert({
    name: payload.name,
    description: payload.description,
    base_price: payload.basePrice,
  });

  if (error) return { error: error.message };

  await revalidateMenu();
  return { success: true };
}

export async function updateDrink(id: string, payload: DrinkPayload) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const validationError = validateDrink(payload);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("drinks")
    .update({
      name: payload.name,
      description: payload.description,
      base_price: payload.basePrice,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await revalidateMenu();
  return { success: true };
}

export async function deleteDrink(id: string) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("drinks").delete().eq("id", id);

  if (error) return { error: error.message };

  await revalidateMenu();
  return { success: true };
}
