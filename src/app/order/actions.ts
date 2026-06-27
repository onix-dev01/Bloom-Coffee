"use server";

import type { CartItem } from "@/lib/types";
import { calcCartItemLineTotal, calcOrderTotal } from "@/lib/order-utils";
import { createClient } from "@/lib/supabase/server";

type SubmitOrderInput = {
  customerName: string;
  items: CartItem[];
};

export async function submitOrder(input: SubmitOrderInput) {
  if (!input.customerName.trim()) {
    return { error: "Please enter your name for pickup." };
  }

  if (input.items.length === 0) {
    return { error: "Add at least one drink to your order." };
  }

  const total = calcOrderTotal(input.items);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName.trim(),
      total,
      user_id: user?.id ?? null,
    })
    .select("id, display_id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Unable to create order." };
  }

  for (const item of input.items) {
    const unitPrice =
      item.basePrice + item.addOns.reduce((sum, addon) => sum + addon.price, 0);
    const lineTotal = calcCartItemLineTotal(item);

    const { data: orderItem, error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        drink_id: item.drinkId,
        drink_name: item.drinkName,
        quantity: item.quantity,
        unit_price: unitPrice,
        line_total: lineTotal,
      })
      .select("id")
      .single();

    if (itemError || !orderItem) {
      return { error: itemError?.message ?? "Unable to save order item." };
    }

    if (item.addOns.length > 0) {
      const { error: addonError } = await supabase.from("order_item_addons").insert(
        item.addOns.map((addon) => ({
          order_item_id: orderItem.id,
          add_on_id: addon.id,
          add_on_name: addon.name,
          price: addon.price,
        })),
      );

      if (addonError) {
        return { error: addonError.message };
      }
    }
  }

  return { orderId: order.id, displayId: order.display_id };
}
