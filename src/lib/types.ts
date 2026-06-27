export type ProfileRole = "admin" | "user";

export type Profile = {
  id: string;
  role: ProfileRole;
  created_at: string;
};

export type Drink = {
  id: string;
  name: string;
  description: string;
  base_price: number;
  created_at: string;
  updated_at: string;
};

export type AddOn = {
  id: string;
  name: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  display_id: number;
  customer_name: string;
  total: number;
  user_id: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  drink_id: string | null;
  drink_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type OrderItemAddOn = {
  id: string;
  order_item_id: string;
  add_on_id: string | null;
  add_on_name: string;
  price: number;
};

export type CartAddOn = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  clientId: string;
  drinkId: string;
  drinkName: string;
  basePrice: number;
  quantity: number;
  addOns: CartAddOn[];
};

export type OrderConfirmation = {
  orderId: string;
  displayId: number;
  customerName: string;
  total: number;
  items: {
    drinkName: string;
    quantity: number;
    addOns: { name: string; price: number }[];
    lineTotal: number;
  }[];
};
