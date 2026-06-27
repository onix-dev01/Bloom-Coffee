import Link from "next/link";
import type { Drink } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type DrinkCardProps = {
  drink: Drink;
};

export function DrinkCard({ drink }: DrinkCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-brand-900">{drink.name}</h2>
        <Badge>{formatPrice(Number(drink.base_price))}</Badge>
      </div>
      <p className="mt-2 flex-1 text-sm text-muted">{drink.description}</p>
      <Link href={`/?drink=${drink.id}`} className="mt-4">
        <Button className="w-full">Add to order</Button>
      </Link>
    </Card>
  );
}
