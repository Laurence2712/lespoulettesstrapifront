-- =============================================================================
-- LIFE MAP — initial schema
--
-- Security model: every table has Row Level Security enabled. The mobile app
-- only ever uses the public "anon" key + the user's JWT, so these policies are
-- the real access control. Client-side checks are a convenience, never a guard.
--
-- Visibility of an experience:
--   private  → owner only
--   friends  → owner + users with an ACCEPTED friendship
--   public   → any signed-in user
-- Anonymous (signed-out) clients can read nothing.
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.visibility as enum ('private', 'friends', 'public');
create type public.experience_category as enum
  ('travel', 'discovery', 'culture', 'encounter', 'creation', 'learning', 'other');
create type public.friendship_status as enum ('pending', 'accepted');
create type public.reaction_kind as enum ('love', 'wow', 'inspired');
create type public.notification_type as enum
  ('friend_request', 'friend_accepted', 'reaction', 'comment');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  username           text not null,
  display_name       text not null,
  bio                text,
  avatar_path        text,
  is_public          boolean not null default true,
  default_visibility public.visibility not null default 'private',
  onboarded          boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9._]{3,24}$'),
  constraint profiles_display_name_length check (char_length(btrim(display_name)) between 1 and 50),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 160)
);
create unique index profiles_username_key on public.profiles (username);
comment on table public.profiles is 'One row per auth user, created automatically on sign-up.';

create table public.experiences (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title       text not null,
  description text,
  category    public.experience_category not null,
  happened_on date not null,
  place_name  text not null,
  latitude    double precision,
  longitude   double precision,
  visibility  public.visibility not null default 'private',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint experiences_title_length check (char_length(btrim(title)) between 2 and 80),
  constraint experiences_description_length check (description is null or char_length(description) <= 1000),
  constraint experiences_place_length check (char_length(btrim(place_name)) between 2 and 120),
  constraint experiences_latitude_range check (latitude is null or latitude between -90 and 90),
  constraint experiences_longitude_range check (longitude is null or longitude between -180 and 180),
  constraint experiences_coordinates_pair check ((latitude is null) = (longitude is null)),
  -- one day of slack for time zones ahead of the server
  constraint experiences_not_future check (happened_on <= current_date + 1)
);
create index experiences_owner_date_idx on public.experiences (owner_id, happened_on desc, created_at desc);
create index experiences_shared_date_idx on public.experiences (happened_on desc, created_at desc)
  where visibility <> 'private';

create table public.experience_media (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  owner_id      uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  storage_path  text not null unique,
  width         integer check (width is null or width > 0),
  height        integer check (height is null or height > 0),
  position      smallint not null default 0 check (position between 0 and 5),
  created_at    timestamptz not null default now(),
  -- files live under "<owner_id>/<experience_id>/…" so storage policies can check the owner
  constraint experience_media_path_owner check (storage_path like owner_id::text || '/' || experience_id::text || '/%')
);
create index experience_media_experience_idx on public.experience_media (experience_id, position);

create table public.friendships (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status       public.friendship_status not null default 'pending',
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  constraint friendships_not_self check (requester_id <> addressee_id)
);
-- one relationship per pair, whatever the direction
create unique index friendships_pair_key on public.friendships
  (least(requester_id, addressee_id), greatest(requester_id, addressee_id));
create index friendships_addressee_idx on public.friendships (addressee_id, status);
create index friendships_requester_idx on public.friendships (requester_id, status);

create table public.reactions (
  experience_id uuid not null references public.experiences (id) on delete cascade,
  user_id       uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind          public.reaction_kind not null,
  created_at    timestamptz not null default now(),
  primary key (experience_id, user_id)
);
create index reactions_user_idx on public.reactions (user_id);

create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  author_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body          text not null,
  created_at    timestamptz not null default now(),
  constraint comments_body_length check (char_length(btrim(body)) between 1 and 500)
);
create index comments_experience_idx on public.comments (experience_id, created_at);
create index comments_author_idx on public.comments (author_id);

create table public.notifications (
  id            uuid primary key default gen_random_uuid(),
  recipient_id  uuid not null references public.profiles (id) on delete cascade,
  actor_id      uuid not null references public.profiles (id) on delete cascade,
  type          public.notification_type not null,
  experience_id uuid references public.experiences (id) on delete cascade,
  created_at    timestamptz not null default now(),
  read_at       timestamptz
);
create index notifications_recipient_idx on public.notifications (recipient_id, created_at desc);
create index notifications_unread_idx on public.notifications (recipient_id) where read_at is null;

-- ---------------------------------------------------------------------------
-- Access helpers (SECURITY DEFINER so policies can use them without recursion)
-- ---------------------------------------------------------------------------
create or replace function public.are_friends(a uuid, b uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select a is not null and b is not null and a <> b and exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.requester_id = a and f.addressee_id = b) or (f.requester_id = b and f.addressee_id = a))
  );
$$;

create or replace function public.can_view_experience(exp_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.experiences e
    where e.id = exp_id
      and auth.uid() is not null
      and (
        e.owner_id = auth.uid()
        or e.visibility = 'public'
        or (e.visibility = 'friends' and public.are_friends(auth.uid(), e.owner_id))
      )
  );
$$;

revoke all on function public.are_friends(uuid, uuid) from public, anon;
revoke all on function public.can_view_experience(uuid) from public, anon;
grant execute on function public.are_friends(uuid, uuid) to authenticated;
grant execute on function public.can_view_experience(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Triggers: timestamps, profile creation, limits, notifications
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger experiences_updated_at before update on public.experiences
  for each row execute function public.set_updated_at();

-- Owner and parent ids are immutable once written.
create or replace function public.prevent_owner_change()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'owner_id cannot be changed';
  end if;
  return new;
end;
$$;
create trigger experiences_owner_immutable before update on public.experiences
  for each row execute function public.prevent_owner_change();

-- Create the profile when a user signs up. Username comes from sign-up metadata
-- when valid and free, otherwise a random one the user can change later.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  wanted text := lower(coalesce(new.raw_user_meta_data ->> 'username', ''));
  chosen text;
begin
  if wanted ~ '^[a-z0-9._]{3,24}$'
     and not exists (select 1 from public.profiles p where p.username = wanted) then
    chosen := wanted;
  else
    chosen := 'user_' || substr(replace(new.id::text, '-', ''), 1, 10);
  end if;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    chosen,
    left(coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), chosen), 50)
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.enforce_media_limit()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if (select count(*) from public.experience_media m where m.experience_id = new.experience_id) >= 6 then
    raise exception 'An experience can have at most 6 photos';
  end if;
  return new;
end;
$$;
create trigger experience_media_limit before insert on public.experience_media
  for each row execute function public.enforce_media_limit();

-- Friendship transitions: only pending → accepted, only by the addressee (also enforced by RLS).
create or replace function public.guard_friendship_update()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.requester_id <> old.requester_id or new.addressee_id <> old.addressee_id then
    raise exception 'friendship participants cannot be changed';
  end if;
  if old.status = 'accepted' and new.status <> 'accepted' then
    raise exception 'an accepted friendship can only be removed, not reverted';
  end if;
  if new.status = 'accepted' and old.status = 'pending' then
    new.responded_at := now();
  end if;
  return new;
end;
$$;
create trigger friendships_guard before update on public.friendships
  for each row execute function public.guard_friendship_update();

-- Notifications are only ever written by these triggers.
create or replace function public.notify_friendship()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.notifications (recipient_id, actor_id, type)
    values (new.addressee_id, new.requester_id, 'friend_request');
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status = 'accepted' then
    insert into public.notifications (recipient_id, actor_id, type)
    values (new.requester_id, new.addressee_id, 'friend_accepted');
  end if;
  return new;
end;
$$;
create trigger friendships_notify after insert or update on public.friendships
  for each row execute function public.notify_friendship();

create or replace function public.notify_experience_activity()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  owner uuid;
  actor uuid;
  kind public.notification_type;
begin
  select e.owner_id into owner from public.experiences e where e.id = new.experience_id;
  if tg_table_name = 'reactions' then
    actor := new.user_id;
    kind := 'reaction';
  else
    actor := new.author_id;
    kind := 'comment';
  end if;
  if owner is not null and owner <> actor then
    insert into public.notifications (recipient_id, actor_id, type, experience_id)
    values (owner, actor, kind, new.experience_id);
  end if;
  return new;
end;
$$;
create trigger reactions_notify after insert on public.reactions
  for each row execute function public.notify_experience_activity();
create trigger comments_notify after insert on public.comments
  for each row execute function public.notify_experience_activity();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.experiences      enable row level security;
alter table public.experience_media enable row level security;
alter table public.friendships      enable row level security;
alter table public.reactions        enable row level security;
alter table public.comments         enable row level security;
alter table public.notifications    enable row level security;

-- Defence in depth: signed-out clients get no table privileges at all.
revoke all on public.profiles, public.experiences, public.experience_media, public.friendships,
  public.reactions, public.comments, public.notifications from anon;

-- profiles ------------------------------------------------------------------
create policy "profiles: read public, own and friends"
  on public.profiles for select to authenticated
  using (is_public or id = auth.uid() or public.are_friends(auth.uid(), id));

create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
-- No insert policy: rows are created by handle_new_user(). No delete policy: see delete_my_account().
revoke update on public.profiles from authenticated;
grant update (username, display_name, bio, avatar_path, is_public, default_visibility, onboarded)
  on public.profiles to authenticated;

-- experiences ---------------------------------------------------------------
create policy "experiences: read when allowed"
  on public.experiences for select to authenticated
  using (
    owner_id = auth.uid()
    or visibility = 'public'
    or (visibility = 'friends' and public.are_friends(auth.uid(), owner_id))
  );

create policy "experiences: insert own"
  on public.experiences for insert to authenticated
  with check (owner_id = auth.uid());

create policy "experiences: update own"
  on public.experiences for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "experiences: delete own"
  on public.experiences for delete to authenticated
  using (owner_id = auth.uid());

-- experience_media ----------------------------------------------------------
create policy "media: read when experience is visible"
  on public.experience_media for select to authenticated
  using (public.can_view_experience(experience_id));

create policy "media: insert on own experience"
  on public.experience_media for insert to authenticated
  with check (
    owner_id = auth.uid()
    and exists (select 1 from public.experiences e where e.id = experience_id and e.owner_id = auth.uid())
  );

create policy "media: delete own"
  on public.experience_media for delete to authenticated
  using (owner_id = auth.uid());

-- friendships ---------------------------------------------------------------
create policy "friendships: read own"
  on public.friendships for select to authenticated
  using (auth.uid() in (requester_id, addressee_id));

create policy "friendships: send request"
  on public.friendships for insert to authenticated
  with check (requester_id = auth.uid() and status = 'pending');

create policy "friendships: addressee accepts"
  on public.friendships for update to authenticated
  using (addressee_id = auth.uid() and status = 'pending')
  with check (addressee_id = auth.uid() and status = 'accepted');

create policy "friendships: either side removes"
  on public.friendships for delete to authenticated
  using (auth.uid() in (requester_id, addressee_id));

revoke update on public.friendships from authenticated;
grant update (status) on public.friendships to authenticated;

-- reactions -----------------------------------------------------------------
create policy "reactions: read when experience is visible"
  on public.reactions for select to authenticated
  using (public.can_view_experience(experience_id));

create policy "reactions: add own on visible experience"
  on public.reactions for insert to authenticated
  with check (user_id = auth.uid() and public.can_view_experience(experience_id));

create policy "reactions: change own"
  on public.reactions for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and public.can_view_experience(experience_id));

create policy "reactions: remove own"
  on public.reactions for delete to authenticated
  using (user_id = auth.uid());

revoke update on public.reactions from authenticated;
grant update (kind) on public.reactions to authenticated;

-- comments ------------------------------------------------------------------
create policy "comments: read when experience is visible"
  on public.comments for select to authenticated
  using (public.can_view_experience(experience_id));

create policy "comments: write own on visible experience"
  on public.comments for insert to authenticated
  with check (author_id = auth.uid() and public.can_view_experience(experience_id));

create policy "comments: author or experience owner deletes"
  on public.comments for delete to authenticated
  using (
    author_id = auth.uid()
    or exists (select 1 from public.experiences e where e.id = experience_id and e.owner_id = auth.uid())
  );

revoke update on public.comments from authenticated;

-- notifications -------------------------------------------------------------
create policy "notifications: read own"
  on public.notifications for select to authenticated
  using (recipient_id = auth.uid());

create policy "notifications: mark own as read"
  on public.notifications for update to authenticated
  using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

create policy "notifications: delete own"
  on public.notifications for delete to authenticated
  using (recipient_id = auth.uid());

revoke insert on public.notifications from authenticated;
revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;

-- ---------------------------------------------------------------------------
-- Account deletion (RGPD). The app first removes the user's files through the
-- Storage API (Supabase forbids deleting storage rows in SQL), then calls this.
-- Deleting auth.users cascades to every table above.
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: private buckets, files stored under "<user_id>/…"
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('experience-media', 'experience-media', false, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('avatars', 'avatars', false, 2097152,
   array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "experience-media: upload into own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'experience-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "experience-media: read own or visible"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'experience-media'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.experience_media m
        where m.storage_path = name and public.can_view_experience(m.experience_id)
      )
    )
  );

create policy "experience-media: delete own"
  on storage.objects for delete to authenticated
  using (bucket_id = 'experience-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: read when signed in"
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars');

create policy "avatars: write own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: replace own"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: delete own"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
