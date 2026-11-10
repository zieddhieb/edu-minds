-- =====================================================================
-- EduMinds data layer v2 (Supabase / PostgreSQL)
-- Order: 1) this file   2) edu_minds_seed.sql
-- Before running: Authentication > enable "Allow anonymous sign-ins"
-- =====================================================================

-- 1. REFERENCE TABLES (small, filled by the seed file) ------------------
create table labs (
  id        smallint primary key,
  code      text unique not null,
  title_fr  text not null
);

create table components (               -- same refs as components.csv (CMP001...)
  ref             text primary key,
  name_fr         text not null,
  category        text,
  unit_price_tnd  numeric(8,2) not null check (unit_price_tnd >= 0),
  price_source    text                    -- 'pdf' / 'estime' / later 'reel'
);

create table failure_types (            -- what a virtual failure would have destroyed for real
  code           text primary key,
  component_ref  text not null references components(ref),
  label_fr       text not null
);

-- 2. PEOPLE ------------------------------------------------------------
create table teachers (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table students (
  id          uuid primary key references auth.users(id) on delete cascade,
  nickname    text not null check (char_length(nickname) between 1 and 40),
  class_name  text,
  created_at  timestamptz not null default now()
);

-- 3. ACTIVITY (written by the app) ---------------------------------------
-- The app creates the ids itself, so a retry after a network failure
-- cannot create duplicates.
create table sessions (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references students(id) on delete cascade,
  lab_id      smallint not null references labs(id),
  device      text,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz                       -- set when the student leaves the TP
);

create table events (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references sessions(id) on delete cascade,
  event_type     text not null check (event_type in
                   ('lab_started', 'component_taken', 'failure_caused', 'hint_used', 'lab_ended')),
  component_ref  text references components(ref),      -- only for 'component_taken'
  failure_code   text references failure_types(code),  -- only for 'failure_caused'
  payload        jsonb not null default '{}'::jsonb,
  occurred_at    timestamptz not null default now(),
  constraint component_matches_type check ((event_type = 'component_taken') = (component_ref is not null)),
  constraint failure_matches_type   check ((event_type = 'failure_caused')  = (failure_code  is not null))
);

create index events_session_idx   on events (session_id);
create index events_type_idx      on events (event_type);
create index sessions_student_idx on sessions (student_id);

-- 4. SECURITY (Row Level Security) --------------------------------------
-- The app key is public (it is inside the app), so these rules are what protect the data.
create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.teachers where user_id = auth.uid());
$$;

alter table labs          enable row level security;
alter table components    enable row level security;
alter table failure_types enable row level security;
alter table teachers      enable row level security;
alter table students      enable row level security;
alter table sessions      enable row level security;
alter table events        enable row level security;

create policy "read labs"          on labs          for select to authenticated using (true);
create policy "read components"    on components    for select to authenticated using (true);
create policy "read failure types" on failure_types for select to authenticated using (true);
create policy "teacher sees self"  on teachers      for select to authenticated using (user_id = auth.uid());

create policy "student inserts self"  on students for insert to authenticated with check (id = auth.uid());
create policy "student updates self"  on students for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "student reads self"    on students for select to authenticated using (id = auth.uid());
create policy "teacher reads students" on students for select to authenticated using (public.is_teacher());

create policy "student inserts own session" on sessions for insert to authenticated with check (student_id = auth.uid());
create policy "student updates own session" on sessions for update to authenticated
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "student reads own sessions"  on sessions for select to authenticated using (student_id = auth.uid());
create policy "teacher reads sessions"      on sessions for select to authenticated using (public.is_teacher());

create policy "student inserts own events" on events for insert to authenticated
  with check (exists (select 1 from sessions s where s.id = session_id and s.student_id = auth.uid()));
create policy "student reads own events"   on events for select to authenticated
  using (exists (select 1 from sessions s where s.id = session_id and s.student_id = auth.uid()));
create policy "teacher reads events"       on events for select to authenticated using (public.is_teacher());

-- 5. DASHBOARD VIEWS (computed from events, never stored twice) -----------
-- security_invoker = true makes the views follow the rules above.

create view common_mistakes with (security_invoker = true) as
select ft.code as failure_code, ft.label_fr, count(*) as times
from events e join failure_types ft on ft.code = e.failure_code
where e.event_type = 'failure_caused'
group by ft.code, ft.label_fr
order by times desc;

-- Every virtual failure = one real component saved
create view failures_prevented with (security_invoker = true) as
select c.ref as component_ref, c.name_fr, count(*) as failures, count(*) * c.unit_price_tnd as saved_tnd
from events e
join failure_types ft on ft.code = e.failure_code
join components c on c.ref = ft.component_ref
where e.event_type = 'failure_caused'
group by c.ref, c.name_fr, c.unit_price_tnd;

create view components_taken with (security_invoker = true) as
select c.ref as component_ref, c.name_fr, count(*) as times_taken
from events e join components c on c.ref = e.component_ref
where e.event_type = 'component_taken'
group by c.ref, c.name_fr
order by times_taken desc;

create view student_progress with (security_invoker = true) as
with per_session as (
  select s.id, s.student_id, s.lab_id, s.started_at, s.ended_at,
         count(e.id) filter (where e.event_type = 'failure_caused')   as failures,
         count(e.id) filter (where e.event_type = 'component_taken')  as taken
  from sessions s left join events e on e.session_id = s.id
  group by s.id
)
select st.id as student_id, st.nickname, st.class_name,
       count(ps.id)                                    as sessions_total,
       count(distinct ps.lab_id)                       as labs_tried,
       coalesce(sum(ps.failures), 0)                   as failures,
       coalesce(sum(ps.taken), 0)                      as components_taken,
       round(avg(extract(epoch from (ps.ended_at - ps.started_at)))
             filter (where ps.ended_at is not null))   as avg_seconds_per_session
from students st left join per_session ps on ps.student_id = st.id
group by st.id, st.nickname, st.class_name;
