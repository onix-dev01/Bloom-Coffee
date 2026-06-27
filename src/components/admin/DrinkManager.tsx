"use client";

import { useState } from "react";
import type { Drink } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  createDrink,
  deleteDrink,
  updateDrink,
} from "@/app/admin/drinks/actions";

type DrinkFormProps = {
  drink?: Drink;
  onDone: () => void;
};

export function DrinkForm({ drink, onDone }: DrinkFormProps) {
  const [name, setName] = useState(drink?.name ?? "");
  const [description, setDescription] = useState(drink?.description ?? "");
  const [basePrice, setBasePrice] = useState(String(drink?.base_price ?? ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      basePrice: Number(basePrice),
    };

    const result = drink
      ? await updateDrink(drink.id, payload)
      : await createDrink(payload);

    setLoading(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="drink-name">Name</Label>
        <Input
          id="drink-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="drink-description">Description</Label>
        <Textarea
          id="drink-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="drink-price">Base price</Label>
        <Input
          id="drink-price"
          type="number"
          min="0"
          step="0.01"
          value={basePrice}
          onChange={(event) => setBasePrice(event.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : drink ? "Save changes" : "Create drink"}
        </Button>
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

type DrinkManagerProps = {
  drinks: Drink[];
};

export function DrinkManager({ drinks }: DrinkManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteDrink(id);
    setDeletingId(null);
  }

  if (creating) {
    return (
      <div className="card-surface p-5">
        <h2 className="mb-4 text-lg font-semibold">New drink</h2>
        <DrinkForm onDone={() => setCreating(false)} />
      </div>
    );
  }

  const editingDrink = drinks.find((drink) => drink.id === editingId);

  if (editingDrink) {
    return (
      <div className="card-surface p-5">
        <h2 className="mb-4 text-lg font-semibold">Edit drink</h2>
        <DrinkForm drink={editingDrink} onDone={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>Add drink</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-brand-50 text-brand-900">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((drink) => (
              <tr key={drink.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{drink.name}</td>
                <td className="px-4 py-3 text-muted">{drink.description}</td>
                <td className="px-4 py-3">${Number(drink.base_price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setEditingId(drink.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      disabled={deletingId === drink.id}
                      onClick={() => handleDelete(drink.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
