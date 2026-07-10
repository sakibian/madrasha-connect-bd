/* Migration: Create all missing tables. Run AFTER fix-rls-recursion.sql. Idempotent. */

-- Tables that may be missing (in dependency order):

create table if not exists public.audit_log (
  id uuid primary key default uuid_generate_v4(),
  action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  target_type text,
  target_id uuid,
  details jsonb,
  created_at timestamptz default now()
);
alter table public.audit_log enable row level security;

do $$ begin
  create policy "Admins can read audit log"
    on public.audit_log for select
    using (public.get_user_role(auth.uid()) = 'ADMIN');
exception when duplicate_object then null;
end $$;


create table if not exists public.content_flags (
  id uuid primary key default uuid_generate_v4(),
  content_type text not null,
  content_id text not null,
  flagged_by uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'dismissed', 'resolved')),
  created_at timestamptz default now(),
  unique(content_type, content_id, flagged_by)
);
create index if not exists idx_content_flags_status on public.content_flags(status);
alter table public.content_flags enable row level security;

do $$ begin
  create policy "Users can read own flags"
    on public.content_flags for select
    using (auth.uid() = flagged_by or public.get_user_role(auth.uid()) = 'ADMIN');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admins can update flags"
    on public.content_flags for update
    using (public.get_user_role(auth.uid()) = 'ADMIN');
exception when duplicate_object then null;
end $$;


create table if not exists public.scholar_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  title text not null,
  specialization text not null,
  institution text,
  location text,
  bio text,
  credentials text[] default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);
alter table public.scholar_applications enable row level security;

do $$ begin
  create policy "Users can read own application"
    on public.scholar_applications for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can submit application"
    on public.scholar_applications for insert with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admins can read all applications"
    on public.scholar_applications for select
    using (public.get_user_role(auth.uid()) = 'ADMIN');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admins can update applications"
    on public.scholar_applications for update
    using (public.get_user_role(auth.uid()) = 'ADMIN');
exception when duplicate_object then null;
end $$;


create table if not exists public.content_versions (
  id uuid primary key default uuid_generate_v4(),
  content_type text not null,
  content_id uuid not null,
  title text,
  body text not null,
  changed_by uuid not null references auth.users(id) on delete cascade,
  change_summary text,
  created_at timestamptz default now()
);
alter table public.content_versions enable row level security;


create table if not exists public.admin_audit_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  details jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_admin_audit_log_admin on public.admin_audit_log(admin_id);
create index if not exists idx_admin_audit_log_action on public.admin_audit_log(action);
create index if not exists idx_admin_audit_log_created on public.admin_audit_log(created_at desc);
alter table public.admin_audit_log enable row level security;

do $$ begin
  create policy "Admins can read audit logs"
    on public.admin_audit_log for select
    using (public.get_user_role(auth.uid()) = 'ADMIN');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admins can insert audit logs"
    on public.admin_audit_log for insert
    with check (public.get_user_role(auth.uid()) = 'ADMIN');
exception when duplicate_object then null;
end $$;
