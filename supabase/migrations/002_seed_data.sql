-- Sample menu data (run after 001_initial_schema.sql)

insert into public.drinks (name, description, base_price) values
  ('House Latte', 'Espresso with steamed milk and a light foam.', 4.50),
  ('Cold Brew', 'Slow-steeped for 16 hours. Smooth and bold.', 4.00),
  ('Cappuccino', 'Equal parts espresso, steamed milk, and foam.', 4.25),
  ('Matcha Latte', 'Ceremonial-grade matcha with oat milk.', 5.00);

insert into public.add_ons (name, price) values
  ('Oat milk', 0.50),
  ('Extra shot', 0.75),
  ('Vanilla syrup', 0.40),
  ('Whipped cream', 0.35);
