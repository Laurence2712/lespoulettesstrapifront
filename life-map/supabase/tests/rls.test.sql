-- =============================================================================
-- LIFE MAP — Row Level Security tests.
-- Runs against a database with the shim + migrations applied (see scripts/test-db.sh).
-- Every check raises an exception on failure, so psql -v ON_ERROR_STOP=1 exits non-zero.
--
-- Cast:
--   alice  owner of the experiences under test
--   bob    alice's ACCEPTED friend
--   carol  sent alice a request that is still PENDING
--   dave   stranger
--   anon   signed-out client
-- =============================================================================
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

create schema test;
grant usage on schema test to anon, authenticated;

create table test.results (n serial, label text);
grant all on test.results to anon, authenticated;
grant usage on sequence test.results_n_seq to anon, authenticated;

create function test.ok(cond boolean, label text) returns void language plpgsql as $$
begin
  if cond is distinct from true then
    raise exception 'FAILED: %', label;
  end if;
  insert into test.results (label) values (label);
end $$;

-- Expect a statement to be rejected (RLS violation, missing privilege, constraint, trigger).
create function test.rejects(stmt text, label text) returns void language plpgsql as $$
begin
  begin
    execute stmt;
  exception when others then
    insert into test.results (label) values (label || ' [' || sqlstate || ']');
    return;
  end;
  raise exception 'FAILED (statement was allowed): %', label;
end $$;

-- Row count affected by a statement (RLS turns forbidden UPDATE/DELETE into 0 rows).
create function test.affected(stmt text) returns bigint language plpgsql as $$
declare n bigint;
begin
  execute stmt;
  get diagnostics n = row_count;
  return n;
end $$;

grant execute on all functions in schema test to anon, authenticated;

-- Impersonation helpers (same mechanism PostgREST uses).
create function test.login(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, false);
$$;
create function test.logout() returns void language sql as $$
  select set_config('request.jwt.claims', '', false);
$$;
grant execute on all functions in schema test to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Fixtures (as superuser, like Supabase Auth would)
-- ---------------------------------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'alice@test.dev', '{"username":"alice","display_name":"Alice"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bob@test.dev',   '{"username":"bob","display_name":"Bob"}'),
  ('00000000-0000-0000-0000-00000000000c', 'carol@test.dev', '{"username":"carol"}'),
  ('00000000-0000-0000-0000-00000000000d', 'dave@test.dev',  '{"username":"ALICE"}'); -- taken → random username

select test.ok((select count(*) = 4 from public.profiles), 'sign-up creates one profile per user');
select test.ok((select username = 'alice' and display_name = 'Alice' from public.profiles where id = '00000000-0000-0000-0000-00000000000a'),
  'profile takes username and display name from sign-up metadata');
select test.ok((select username like 'user\_%' from public.profiles where id = '00000000-0000-0000-0000-00000000000d'),
  'a taken username falls back to a generated one');
select test.ok((select display_name = username from public.profiles where id = '00000000-0000-0000-0000-00000000000c'),
  'display name defaults to the username');

-- ---------------------------------------------------------------------------
-- Everything below runs as the "authenticated" / "anon" API roles.
-- ---------------------------------------------------------------------------
set role authenticated;

-- alice creates experiences ----------------------------------------------------
select test.login('00000000-0000-0000-0000-00000000000a');
insert into public.experiences (id, title, category, happened_on, place_name, latitude, longitude, visibility) values
  ('10000000-0000-0000-0000-000000000001', 'Journal intime', 'other', current_date, 'Chez moi', 50.85, 4.35, 'private'),
  ('10000000-0000-0000-0000-000000000002', 'Soirée entre amis', 'encounter', current_date, 'Ixelles', 50.83, 4.37, 'friends'),
  ('10000000-0000-0000-0000-000000000003', 'Lisbonne', 'travel', current_date - 10, 'Alfama, Lisbonne', 38.71, -9.13, 'public');
select test.ok((select count(*) = 3 from public.experiences where owner_id = auth.uid()), 'owner_id defaults to the signed-in user');

insert into public.experience_media (experience_id, storage_path) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a/10000000-0000-0000-0000-000000000001/a.jpg'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000000a/10000000-0000-0000-0000-000000000002/b.jpg'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-00000000000a/10000000-0000-0000-0000-000000000003/c.jpg');
insert into storage.objects (bucket_id, name) values
  ('experience-media', '00000000-0000-0000-0000-00000000000a/10000000-0000-0000-0000-000000000001/a.jpg'),
  ('experience-media', '00000000-0000-0000-0000-00000000000a/10000000-0000-0000-0000-000000000002/b.jpg'),
  ('experience-media', '00000000-0000-0000-0000-00000000000a/10000000-0000-0000-0000-000000000003/c.jpg');
select test.ok(true, 'owner uploads photos into own folder');

select test.rejects($$insert into public.experiences (owner_id, title, category, happened_on, place_name)
  values ('00000000-0000-0000-0000-00000000000b', 'Usurpation', 'other', current_date, 'Ailleurs')$$,
  'cannot create an experience on behalf of someone else');
select test.rejects($$insert into public.experiences (title, category, happened_on, place_name)
  values ('Futur', 'other', current_date + 30, 'Demain')$$, 'rejects a date far in the future');
select test.rejects($$insert into public.experiences (title, category, happened_on, place_name, latitude)
  values ('Moitié', 'other', current_date, 'Quelque part', 10)$$, 'rejects latitude without longitude');
select test.rejects($$insert into public.experiences (title, category, happened_on, place_name, latitude, longitude)
  values ('Hors carte', 'other', current_date, 'Nulle part', 120, 0)$$, 'rejects out-of-range coordinates');
select test.rejects($$insert into public.experiences (title, category, happened_on, place_name)
  values (' ', 'other', current_date, 'Ici')$$, 'rejects a blank title');
select test.rejects($$insert into storage.objects (bucket_id, name)
  values ('experience-media', '00000000-0000-0000-0000-00000000000b/x/evil.jpg')$$, 'cannot upload into another user''s folder');
select test.rejects($$insert into public.experience_media (experience_id, storage_path)
  values ('10000000-0000-0000-0000-000000000001', 'somewhere-else/x.jpg')$$, 'media path must live in owner/experience folder');

-- friendships ---------------------------------------------------------------------
select test.login('00000000-0000-0000-0000-00000000000b');
insert into public.friendships (addressee_id) values ('00000000-0000-0000-0000-00000000000a');
select test.ok((select count(*) = 0 from public.notifications), 'a friend request notifies only the addressee');

select test.login('00000000-0000-0000-0000-00000000000a');
select test.ok((select count(*) = 1 from public.notifications where type = 'friend_request'), 'addressee is notified of a friend request');
select test.ok(test.affected($$update public.friendships set status = 'accepted' where requester_id = '00000000-0000-0000-0000-00000000000b'$$) = 1,
  'addressee accepts the request');

select test.login('00000000-0000-0000-0000-00000000000b');
select test.ok((select count(*) = 1 from public.notifications where type = 'friend_accepted'), 'requester is notified of the acceptance');

select test.login('00000000-0000-0000-0000-00000000000c');
insert into public.friendships (addressee_id) values ('00000000-0000-0000-0000-00000000000a');
select test.ok(test.affected($$update public.friendships set status = 'accepted' where requester_id = '00000000-0000-0000-0000-00000000000c'$$) = 0,
  'requester cannot accept their own request');
select test.rejects($$insert into public.friendships (requester_id, addressee_id, status)
  values ('00000000-0000-0000-0000-00000000000c', '00000000-0000-0000-0000-00000000000d', 'accepted')$$,
  'cannot create an already-accepted friendship');
select test.rejects($$insert into public.friendships (requester_id, addressee_id)
  values ('00000000-0000-0000-0000-00000000000d', '00000000-0000-0000-0000-00000000000b')$$,
  'cannot send a request on behalf of someone else');

select test.login('00000000-0000-0000-0000-00000000000a');
select test.rejects($$insert into public.friendships (addressee_id) values ('00000000-0000-0000-0000-00000000000c')$$,
  'only one friendship per pair, whatever the direction');
select test.rejects($$update public.friendships set requester_id = '00000000-0000-0000-0000-00000000000d'
  where requester_id = '00000000-0000-0000-0000-00000000000c'$$, 'cannot rewrite friendship participants');

select test.login('00000000-0000-0000-0000-00000000000d');
select test.ok((select count(*) = 0 from public.friendships), 'strangers cannot see other people''s friendships');

-- visibility matrix ------------------------------------------------------------------
select test.login('00000000-0000-0000-0000-00000000000a');
select test.ok((select count(*) = 3 from public.experiences), 'owner sees all own experiences (private included)');

select test.login('00000000-0000-0000-0000-00000000000b');
select test.ok((select array_agg(visibility::text order by visibility) = '{friends,public}' from public.experiences),
  'accepted friend sees friends + public, never private');
select test.ok((select count(*) = 2 from public.experience_media), 'friend sees media of visible experiences only');
select test.ok((select count(*) = 2 from storage.objects where bucket_id = 'experience-media'),
  'friend can download files of visible experiences only');

select test.login('00000000-0000-0000-0000-00000000000c');
select test.ok((select array_agg(visibility::text) = '{public}' from public.experiences),
  'pending request gives no friends-only access');

select test.login('00000000-0000-0000-0000-00000000000d');
select test.ok((select array_agg(visibility::text) = '{public}' from public.experiences), 'stranger sees public only');
select test.ok((select count(*) = 0 from storage.objects
  where name like '%10000000-0000-0000-0000-000000000001%'), 'stranger cannot fetch the private photo file');
select test.ok(not public.can_view_experience('10000000-0000-0000-0000-000000000001'), 'helper agrees: private is hidden');

-- tampering ---------------------------------------------------------------------------
select test.ok(test.affected($$update public.experiences set title = 'Piraté' where id = '10000000-0000-0000-0000-000000000003'$$) = 0,
  'stranger cannot edit a public experience');
select test.ok(test.affected($$delete from public.experiences where id = '10000000-0000-0000-0000-000000000003'$$) = 0,
  'stranger cannot delete a public experience');
select test.ok(test.affected($$delete from storage.objects where bucket_id = 'experience-media'$$) = 0,
  'stranger cannot delete someone else''s files');

select test.login('00000000-0000-0000-0000-00000000000b');
select test.ok(test.affected($$update public.experiences set visibility = 'public' where id = '10000000-0000-0000-0000-000000000002'$$) = 0,
  'friend cannot change visibility of alice''s experience');

select test.login('00000000-0000-0000-0000-00000000000a');
select test.rejects($$update public.experiences set owner_id = '00000000-0000-0000-0000-00000000000b'
  where id = '10000000-0000-0000-0000-000000000003'$$, 'owner cannot hand an experience to someone else');

-- reactions & comments -----------------------------------------------------------------
select test.login('00000000-0000-0000-0000-00000000000b');
insert into public.reactions (experience_id, kind) values ('10000000-0000-0000-0000-000000000002', 'love');
insert into public.comments (experience_id, body) values ('10000000-0000-0000-0000-000000000002', 'Super soirée !');
select test.ok(true, 'friend reacts and comments on a friends-only experience');
select test.rejects($$insert into public.reactions (experience_id, kind) values ('10000000-0000-0000-0000-000000000001', 'wow')$$,
  'cannot react to an experience you cannot see');
select test.rejects($$insert into public.comments (experience_id, body) values ('10000000-0000-0000-0000-000000000001', 'coucou')$$,
  'cannot comment on an experience you cannot see');
select test.rejects($$insert into public.reactions (experience_id, user_id, kind)
  values ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-00000000000d', 'wow')$$,
  'cannot react on behalf of someone else');
select test.rejects($$update public.comments set body = 'modifié'$$, 'comments cannot be edited');

select test.login('00000000-0000-0000-0000-00000000000d');
select test.ok((select count(*) = 0 from public.comments), 'stranger cannot read comments of a friends-only experience');
insert into public.comments (experience_id, body) values ('10000000-0000-0000-0000-000000000003', 'Belle ville');
select test.ok(test.affected($$delete from public.comments where body = 'Super soirée !'$$) = 0,
  'cannot delete someone else''s comment');

select test.login('00000000-0000-0000-0000-00000000000a');
select test.ok((select count(*) = 2 from public.notifications where type in ('reaction', 'comment')
  and experience_id = '10000000-0000-0000-0000-000000000002'), 'owner is notified of reactions and comments');
select test.ok(test.affected($$delete from public.comments where body = 'Belle ville'$$) = 1,
  'experience owner can moderate comments on their experience');
select test.rejects($$insert into public.notifications (recipient_id, actor_id, type)
  values ('00000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-00000000000a', 'reaction')$$,
  'clients cannot forge notifications');
select test.ok(test.affected($$update public.notifications set read_at = now()$$) >= 3, 'recipient marks notifications as read');
select test.rejects($$update public.notifications set recipient_id = '00000000-0000-0000-0000-00000000000b'$$,
  'cannot redirect a notification');

select test.login('00000000-0000-0000-0000-00000000000b');
select test.ok((select count(*) = 0 from public.notifications where recipient_id = '00000000-0000-0000-0000-00000000000a'),
  'users only see their own notifications');

-- profiles -----------------------------------------------------------------------------
select test.ok(test.affected($$update public.profiles set bio = 'hack' where id = '00000000-0000-0000-0000-00000000000a'$$) = 0,
  'cannot edit someone else''s profile');
select test.ok(test.affected($$update public.profiles set bio = 'Photographe' where id = auth.uid()$$) = 1, 'can edit own profile');
select test.rejects($$update public.profiles set username = 'alice' where id = auth.uid()$$, 'usernames are unique');
select test.rejects($$update public.profiles set username = 'Pas Valide!' where id = auth.uid()$$, 'username format is enforced');
select test.rejects($$update public.profiles set created_at = now() where id = auth.uid()$$, 'system columns are read-only');

select test.login('00000000-0000-0000-0000-00000000000a');
update public.profiles set is_public = false where id = auth.uid();
select test.login('00000000-0000-0000-0000-00000000000d');
select test.ok((select count(*) = 0 from public.profiles where username = 'alice'), 'hidden profile is invisible to strangers');
select test.login('00000000-0000-0000-0000-00000000000b');
select test.ok((select count(*) = 1 from public.profiles where username = 'alice'), 'hidden profile stays visible to friends');

-- media limit ---------------------------------------------------------------------------
select test.login('00000000-0000-0000-0000-00000000000a');
insert into public.experience_media (experience_id, storage_path, position)
select '10000000-0000-0000-0000-000000000003',
       '00000000-0000-0000-0000-00000000000a/10000000-0000-0000-0000-000000000003/extra' || g || '.jpg', g
from generate_series(1, 5) g;
select test.rejects($$insert into public.experience_media (experience_id, storage_path)
  values ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-00000000000a/10000000-0000-0000-0000-000000000003/7.jpg')$$,
  'an experience holds at most 6 photos');

-- un-friending revokes access -------------------------------------------------------------
select test.login('00000000-0000-0000-0000-00000000000b');
select test.ok(test.affected($$delete from public.friendships where requester_id = '00000000-0000-0000-0000-00000000000b'$$) = 1,
  'either side can end a friendship');
select test.ok((select array_agg(visibility::text) = '{public}' from public.experiences),
  'after un-friending, friends-only content disappears');

-- signed-out client --------------------------------------------------------------------------
reset role;
select test.logout();
set role anon;
select test.rejects($$select count(*) from public.experiences$$, 'signed-out client cannot read experiences');
select test.rejects($$select count(*) from public.profiles$$, 'signed-out client cannot read profiles');
select test.ok((select count(*) = 0 from storage.objects), 'signed-out client cannot list files');
select test.rejects($$select public.delete_my_account()$$, 'signed-out client cannot call account deletion');

-- account deletion -----------------------------------------------------------------------------
reset role;
set role authenticated;
select test.login('00000000-0000-0000-0000-00000000000a');
select public.delete_my_account();
reset role;
select test.ok((select count(*) = 0 from public.profiles where id = '00000000-0000-0000-0000-00000000000a'), 'account deletion removes the profile');
select test.ok((select count(*) = 0 from public.experiences where owner_id = '00000000-0000-0000-0000-00000000000a'), 'account deletion removes experiences');
select test.ok((select count(*) = 0 from public.experience_media where owner_id = '00000000-0000-0000-0000-00000000000a'), 'account deletion removes media rows');
select test.ok((select count(*) = 0 from public.friendships where '00000000-0000-0000-0000-00000000000a' in (requester_id, addressee_id)),
  'account deletion removes friendships');
select test.ok((select count(*) = 0 from public.notifications where '00000000-0000-0000-0000-00000000000a' in (recipient_id, actor_id)),
  'account deletion removes notifications');

\o
\set QUIET 0
select count(*) as passed from test.results;
