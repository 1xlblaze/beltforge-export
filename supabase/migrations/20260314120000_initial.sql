-- BeltForge Export — wholesale catalog & inquiries

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  long_description text not null default '',
  price_usd numeric(10, 2) not null,
  moq integer not null default 50,
  material text not null,
  width_cm numeric(4, 1) not null,
  image_url text not null,
  category text not null,
  featured boolean not null default false,
  export_ready boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.export_inquiries (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_email text not null,
  country_code text not null,
  notes text,
  items jsonb not null,
  total_usd numeric(12, 2) not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.export_inquiries enable row level security;

create policy "Public read export-ready products"
  on public.products for select
  using (export_ready = true);

create policy "Anyone can submit export inquiry"
  on public.export_inquiries for insert
  with check (true);

create policy "No public read on inquiries"
  on public.export_inquiries for select
  using (false);

insert into public.products (slug, name, description, long_description, price_usd, moq, material, width_cm, image_url, category, featured, export_ready)
values
  ('midnight-artisan-leather', 'Midnight Artisan Leather', 'Hand-tooled full-grain belt with brushed nickel buckle.', 'Crafted in small batches for international boutiques.', 42, 50, 'Full-grain leather', 3.5, 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&q=80', 'Classic', true, true),
  ('woven-desert-suede', 'Woven Desert Suede', 'Textured suede with contrast stitch and matte brass hardware.', 'Suede sourced for color consistency across bulk orders.', 38, 75, 'Suede', 4, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Contemporary', true, true),
  ('atelier-chain-belt', 'Atelier Chain Belt', 'Designer chain-accent belt for elevated street-luxury lines.', 'Modular chain links with reinforced leather core.', 56, 40, 'Leather + alloy', 3, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80', 'Designer', true, true)
on conflict (slug) do nothing;
