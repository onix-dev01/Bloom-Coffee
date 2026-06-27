import type { CartItem } from "@/lib/types";

export function calcLineTotal(
  basePrice: number,
  addonPrices: number[],
  quantity: number,
): number {
  const unitTotal =
    basePrice + addonPrices.reduce((sum, price) => sum + price, 0);
  return roundCurrency(unitTotal * quantity);
}

export function calcCartItemLineTotal(item: CartItem): number {
  return calcLineTotal(
    item.basePrice,
    item.addOns.map((addon) => addon.price),
    item.quantity,
  );
}

export function calcOrderTotal(items: CartItem[]): number {
  return roundCurrency(items.reduce((sum, item) => sum + calcCartItemLineTotal(item), 0));
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
