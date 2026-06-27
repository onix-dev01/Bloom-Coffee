"use client";

import type { CartItem } from "@/lib/types";
import { calcCartItemLineTotal, calcOrderTotal } from "@/lib/order-utils";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type OrderSummaryProps = {
  items: CartItem[];
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
  error?: string | null;
};

export function OrderSummary({
  items,
  customerName,
  onCustomerNameChange,
  onSubmit,
  submitting = false,
  error,
}: OrderSummaryProps) {
  const total = calcOrderTotal(items);

  return (
    <Card className="sticky top-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-brand-900">Your order</h2>
        <p className="text-sm text-muted">Review items before submitting.</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">Add a drink to get started.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.clientId} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-brand-900">
                    {item.quantity}× {item.drinkName}
                  </p>
                  {item.addOns.length > 0 ? (
                    <p className="mt-1 text-xs text-muted">
                      {item.addOns.map((addon) => addon.name).join(", ")}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(calcCartItemLineTotal(item))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between border-t pt-4 text-base font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <div>
        <Label htmlFor="customer-name">Name for pickup</Label>
        <Input
          id="customer-name"
          placeholder="Who should we call?"
          value={customerName}
          onChange={(event) => onCustomerNameChange(event.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button
        className="w-full"
        disabled={items.length === 0 || !customerName.trim() || submitting}
        onClick={onSubmit}
      >
        {submitting ? "Submitting..." : "Submit order"}
      </Button>
    </Card>
  );
}
