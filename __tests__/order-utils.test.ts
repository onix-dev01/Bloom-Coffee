import { describe, expect, it } from "vitest";
import {
  calcLineTotal,
  calcOrderTotal,
  calcCartItemLineTotal,
  roundCurrency,
} from "@/lib/order-utils";
import type { CartItem } from "@/lib/types";

describe("calcLineTotal", () => {
  it("adds base price and add-ons then multiplies by quantity", () => {
    expect(calcLineTotal(4, [0.5, 0.75], 1)).toBe(5.25);
    expect(calcLineTotal(4, [0.5, 0.75], 2)).toBe(10.5);
  });

  it("handles zero add-ons", () => {
    expect(calcLineTotal(4.5, [], 2)).toBe(9);
  });
});

describe("calcCartItemLineTotal", () => {
  it("calculates from a cart item", () => {
    const item: CartItem = {
      clientId: "1",
      drinkId: "d1",
      drinkName: "Latte",
      basePrice: 4,
      quantity: 2,
      addOns: [{ id: "a1", name: "Oat milk", price: 0.5 }],
    };

    expect(calcCartItemLineTotal(item)).toBe(9);
  });
});

describe("calcOrderTotal", () => {
  it("sums multiple line items", () => {
    const items: CartItem[] = [
      {
        clientId: "1",
        drinkId: "d1",
        drinkName: "Latte",
        basePrice: 4.5,
        quantity: 1,
        addOns: [],
      },
      {
        clientId: "2",
        drinkId: "d2",
        drinkName: "Cold Brew",
        basePrice: 4,
        quantity: 2,
        addOns: [{ id: "a1", name: "Extra shot", price: 0.75 }],
      },
    ];

    expect(calcOrderTotal(items)).toBe(14);
  });

  it("returns zero for an empty order", () => {
    expect(calcOrderTotal([])).toBe(0);
  });
});

describe("roundCurrency", () => {
  it("rounds to two decimal places", () => {
    expect(roundCurrency(10.005)).toBe(10.01);
    expect(roundCurrency(4.999)).toBe(5);
  });
});
