-- ============================================================================
--  جدول متابعة حفظ القرآن — مخطط قاعدة البيانات (Supabase / PostgreSQL)
--  Quran Tracker — initial schema
--
--  يخزّن هذا المخطط لوحة متابعة واحدة لكل طالبة في صف واحد من جدول `trackers`،
--  محتواها كامل (الأسبوع الحالي + الأرشيف) داخل عمود JSONB واحد.
--
--  المزامنة "مفتوحة" (بدون رمز PIN) وتتم حصراً عبر دالتَي RPC أدناه، بينما تمنع
--  سياسات RLS الوصول المباشر للجدول من مفتاح المتصفح العام.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) الجدول الأساسي
-- ----------------------------------------------------------------------------
create table if not exists public.trackers (
  id          text primary key,               -- معرّف اللوحة، مثل 'yasmin'
  data        jsonb not null default '{}'::jsonb,
  saved_at    bigint not null default 0,       -- طابع زمني (ms) من العميل لحل التعارض
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.trackers is 'لوحات متابعة حفظ القرآن — صف واحد لكل طالبة، المحتوى كاملاً في عمود data (JSONB).';

-- ----------------------------------------------------------------------------
-- 2) تفعيل RLS ومنع الوصول المباشر (كل الوصول يمرّ عبر دوال RPC الآمنة)
-- ----------------------------------------------------------------------------
alter table public.trackers enable row level security;

-- لا نُنشئ أي سياسة تسمح بالقراءة/الكتابة المباشرة عبر مفتاح anon.
-- وبذلك يتعذّر على المتصفح قراءة الجدول أو تعديله إلا من خلال الدوال أدناه
-- (المعرّفة بـ SECURITY DEFINER فتتخطّى RLS بأمان ومنطق محدود).

-- ----------------------------------------------------------------------------
-- 3) دالة الحفظ — upsert للمحتوى الكامل
-- ----------------------------------------------------------------------------
create or replace function public.tracker_save(p_id text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_id is null or length(trim(p_id)) = 0 then
    raise exception 'INVALID_ID';
  end if;

  insert into public.trackers (id, data, saved_at, updated_at)
  values (
    p_id,
    p_data,
    coalesce((p_data ->> 'savedAt')::bigint, 0),
    now()
  )
  on conflict (id) do update
    set data     = excluded.data,
        saved_at = excluded.saved_at,
        updated_at = now();
end;
$$;

-- ----------------------------------------------------------------------------
-- 4) دالة القراءة — تعيد محتوى اللوحة (أو NULL إن لم توجد)
-- ----------------------------------------------------------------------------
create or replace function public.tracker_load(p_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_data jsonb;
begin
  select data into v_data from public.trackers where id = p_id;
  return v_data;  -- NULL إذا لم يوجد صف
end;
$$;

-- ----------------------------------------------------------------------------
-- 5) دالة فحص الوجود (اختيارية — يستخدمها بعض العملاء)
-- ----------------------------------------------------------------------------
create or replace function public.tracker_exists(p_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.trackers where id = p_id);
$$;

-- ----------------------------------------------------------------------------
-- 6) صلاحيات التنفيذ لدور anon/authenticated فقط على الدوال
-- ----------------------------------------------------------------------------
grant execute on function public.tracker_save(text, jsonb)  to anon, authenticated;
grant execute on function public.tracker_load(text)         to anon, authenticated;
grant execute on function public.tracker_exists(text)       to anon, authenticated;
