"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AddOn, CartItem, Drink } from "@/lib/types";
import { calcCartItemLineTotal } from "@/lib/order-utils";
import { formatPrice } from "@/lib/format";
import { submitOrder } from "@/app/order/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { OrderSummary } from "@/components/customer/OrderSummary";

type OrderBuilderProps = {
  drinks: Drink[];
  addOns: AddOn[];
  initialDrinkId?: string;
};

function createClientId() {
  return crypto.randomUUID();
}

export function OrderBuilder({ drinks, addOns, initialDrinkId }: OrderBuilderProps) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedDrinkId, setSelectedDrinkId] = useState(initialDrinkId ?? drinks[0]?.id ?? "");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDrink = useMemo(
    () => drinks.find((drink) => drink.id === selectedDrinkId),
    [drinks, selectedDrinkId],
  );

  const previewTotal = useMemo(() => {
    if (!selectedDrink) return 0;
    const selected = addOns.filter((addon) => selectedAddOnIds.includes(addon.id));
    return calcCartItemLineTotal({
      clientId: "preview",
      drinkId: selectedDrink.id,
      drinkName: selectedDrink.name,
      basePrice: Number(selectedDrink.base_price),
      quantity,
      addOns: selected.map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: Number(addon.price),
      })),
    });
  }, [addOns, quantity, selectedAddOnIds, selectedDrink]);

  function toggleAddOn(addOnId: string) {
    setSelectedAddOnIds((current) =>
      current.includes(addOnId)
        ? current.filter((id) => id !== addOnId)
        : [...current, addOnId],
    );
  }

  function addItemToOrder() {
    if (!selectedDrink) return;

    const chosenAddOns = addOns
      .filter((addon) => selectedAddOnIds.includes(addon.id))
      .map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: Number(addon.price),
      }));

    setItems((current) => [
      ...current,
      {
        clientId: createClientId(),
        drinkId: selectedDrink.id,
        drinkName: selectedDrink.name,
        basePrice: Number(selectedDrink.base_price),
        quantity,
        addOns: chosenAddOns,
      },
    ]);

    setSelectedAddOnIds([]);
    setQuantity(1);
    setError(null);
  }

  function updateQuantity(clientId: string, nextQuantity: number) {
    if (nextQuantity < 1) return;
    setItems((current) =>
      current.map((item) =>
        item.clientId === clientId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  }

  function removeItem(clientId: string) {
    setItems((current) => current.filter((item) => item.clientId !== clientId));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const result = await submitOrder({
      customerName: customerName.trim(),
      items,
    });

    setSubmitting(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    router.push(`/order/confirmation?id=${result.orderId}`);
  }

  if (drinks.length === 0) {
    return (
      <EmptyState
        title="Menu is empty"
        description="An admin needs to add drinks before customers can order."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-brand-900">Build a drink</h2>
            <p className="text-sm text-muted">Choose a drink, add-ons, and quantity.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Drink</label>
            <select
              className="input-field"
              value={selectedDrinkId}
              onChange={(event) => setSelectedDrinkId(event.target.value)}
            >
              {drinks.map((drink) => (
                <option key={drink.id} value={drink.id}>
                  {drink.name} — {formatPrice(Number(drink.base_price))}
                </option>
              ))}
            </select>
          </div>

          {addOns.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-medium">Add-ons</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {addOns.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAddOnIds.includes(addon.id)}
                      onChange={() => toggleAddOn(addon.id)}
                      className="h-4 w-4 accent-brand-700"
                    />
                    <span className="flex-1 text-sm">{addon.name}</span>
                    <span className="text-sm text-muted">
                      +{formatPrice(Number(addon.price))}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                className="w-24"
              />
            </div>
            <div className="text-sm text-muted">
              Line preview: <span className="font-medium text-brand-900">{formatPrice(previewTotal)}</span>
            </div>
          </div>

          <Button onClick={addItemToOrder}>Add to order</Button>
        </Card>

        {items.length > 0 ? (
          <Card className="space-y-4 lg:hidden">
            <h2 className="text-lg font-semibold text-brand-900">Items in cart</h2>
            {items.map((item) => (
              <div key={item.clientId} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.drinkName}</p>
                    {item.addOns.length > 0 ? (
                      <p className="mt-1 text-xs text-muted">
                        {item.addOns.map((addon) => addon.name).join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-medium">{formatPrice(calcCartItemLineTotal(item))}</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => updateQuantity(item.clientId, item.quantity - 1)}
                  >
                    −
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="secondary"
                    onClick={() => updateQuantity(item.clientId, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-auto text-danger"
                    onClick={() => removeItem(item.clientId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        ) : null}

        {items.length > 0 ? (
          <Card className="hidden space-y-4 lg:block">
            <h2 className="text-lg font-semibold text-brand-900">Items in cart</h2>
            {items.map((item) => (
              <div key={item.clientId} className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.drinkName}</p>
                  {item.addOns.length > 0 ? (
                    <p className="text-xs text-muted">
                      {item.addOns.map((addon) => addon.name).join(", ")}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => updateQuantity(item.clientId, item.quantity - 1)}>−</Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button variant="secondary" onClick={() => updateQuantity(item.clientId, item.quantity + 1)}>+</Button>
                  <Button variant="ghost" className="text-danger" onClick={() => removeItem(item.clientId)}>Remove</Button>
                </div>
              </div>
            ))}
          </Card>
        ) : null}
      </div>

      <OrderSummary
        items={items}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    </div>
  );
}
