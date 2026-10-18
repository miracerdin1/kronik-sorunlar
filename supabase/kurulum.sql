-- Kronik Sorunlar: kullanıcı katkısı tabloları.
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın. Tekrar çalıştırmak güvenlidir.
-- Ziyaretçiler anonim oturumla (Authentication > Sign In / Providers > Allow anonymous sign-ins) tanınır.

-- "Ben de yaşadım" işaretleri: her kullanıcı bir soruna bir kez işaret koyabilir.
create table if not exists public.deneyimler (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- marka/model/kasa/sorun-id, ör. "fiat/egea/egea-356/dpf-tikanmasi"
  sorun_anahtari text not null check (sorun_anahtari ~ '^[a-z0-9-]+(/[a-z0-9-]+){3}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, sorun_anahtari)
);

alter table public.deneyimler enable row level security;

drop policy if exists "kendi işaretini görür" on public.deneyimler;
create policy "kendi işaretini görür" on public.deneyimler for select to authenticated using (user_id = auth.uid());
drop policy if exists "kendi işaretini ekler" on public.deneyimler;
create policy "kendi işaretini ekler" on public.deneyimler for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "kendi işaretini kaldırır" on public.deneyimler;
create policy "kendi işaretini kaldırır" on public.deneyimler for delete to authenticated using (user_id = auth.uid());

-- Herkese açık sayılar. Görünüm sahibinin yetkisiyle çalışır, kimin işaret koyduğunu göstermez.
create or replace view public.deneyim_sayilari as
  select sorun_anahtari, count(*)::int as sayi from public.deneyimler group by sorun_anahtari;
grant select on public.deneyim_sayilari to anon, authenticated;

-- Listede olmayan sorun bildirimleri. Sitede gösterilmez; incelenip kaynakla doğrulanırsa veriye eklenir.
create table if not exists public.bildirimler (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- marka/model/kasa, ör. "fiat/egea/egea-356"
  arac_anahtari text not null check (arac_anahtari ~ '^[a-z0-9-]+(/[a-z0-9-]+){2}$'),
  motor text check (char_length(motor) <= 60),
  baslik text not null check (char_length(baslik) between 5 and 120),
  aciklama text not null check (char_length(aciklama) between 20 and 2000),
  km integer check (km between 0 and 2000000),
  durum text not null default 'yeni' check (durum in ('yeni', 'eklendi', 'reddedildi')),
  created_at timestamptz not null default now()
);

alter table public.bildirimler enable row level security;

drop policy if exists "bildirim ekler" on public.bildirimler;
create policy "bildirim ekler" on public.bildirimler for insert to authenticated
  with check (user_id = auth.uid() and durum = 'yeni');

-- Kötüye kullanıma karşı: bir kullanıcı 24 saatte en fazla 5 bildirim gönderebilir.
create or replace function public.bildirim_siniri() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.bildirimler where user_id = new.user_id and created_at > now() - interval '24 hours') >= 5 then
    raise exception 'Günlük bildirim sınırına ulaşıldı';
  end if;
  return new;
end $$;

drop trigger if exists bildirim_siniri on public.bildirimler;
create trigger bildirim_siniri before insert on public.bildirimler for each row execute function public.bildirim_siniri();
