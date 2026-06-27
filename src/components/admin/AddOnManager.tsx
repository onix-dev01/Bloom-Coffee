"use client";

import { useState } from "react";
import type { AddOn } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  createAddOn,
  deleteAddOn,
  updateAddOn,
} from "@/app/admin/add-ons/actions";

type AddOnFormProps = {
  addOn?: AddOn;
  onDone: () => void;
};

function AddOnForm({ addOn, onDone }: AddOnFormProps) {
  const [name, setName] = useState(addOn?.name ?? "");
  const [price, setPrice] = useState(String(addOn?.price ?? ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name: name.trim(), price: Number(price) };
    const result = addOn
      ? await updateAddOn(addOn.id, payload)
      : await createAddOn(payload);

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
        <Label htmlFor="addon-name">Name</Label>
        <Input
          id="addon-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="addon-price">Price</Label>
        <Input
          id="addon-price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : addOn ? "Save changes" : "Create add-on"}
        </Button>
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

type AddOnManagerProps = {
  addOns: AddOn[];
};

export function AddOnManager({ addOns }: AddOnManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteAddOn(id);
    setDeletingId(null);
  }

  if (creating) {
    return (
      <div className="card-surface p-5">
        <h2 className="mb-4 text-lg font-semibold">New add-on</h2>
        <AddOnForm onDone={() => setCreating(false)} />
      </div>
    );
  }

  const editingAddOn = addOns.find((addon) => addon.id === editingId);

  if (editingAddOn) {
    return (
      <div className="card-surface p-5">
        <h2 className="mb-4 text-lg font-semibold">Edit add-on</h2>
        <AddOnForm addOn={editingAddOn} onDone={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>Add add-on</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-brand-50 text-brand-900">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {addOns.map((addon) => (
              <tr key={addon.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{addon.name}</td>
                <td className="px-4 py-3">+${Number(addon.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setEditingId(addon.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      disabled={deletingId === addon.id}
                      onClick={() => handleDelete(addon.id)}
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
