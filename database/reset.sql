/* Full data reset — wipes ALL rows in public tables and auth.users.
 * Run this for a clean slate before re-seeding.
 * Safe to run: it only deletes data, not the schema.
 */
do $$
declare
  r record;
begin
  -- Disable FK checks / triggers so we can truncate in any order.
  execute 'set session_replication_role = replica;';

  for r in (select schemaname, tablename from pg_tables where schemaname = 'public') loop
    execute format('truncate table %I.%I restart identity cascade;', r.schemaname, r.tablename);
  end loop;

  -- Wipe auth (users + dependent identities/sessions).
  execute 'truncate table auth.users cascade;';

  execute 'set session_replication_role = default;';
  raise notice 'All data wiped.';
end $$;
