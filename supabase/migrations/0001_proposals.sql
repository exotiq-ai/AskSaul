-- Proposal builder v2: canonical proposals table
-- All submissions land here. service_details + vertical_details are jsonb so we
-- don't explode column count when branches evolve.

create extension if not exists "pgcrypto";

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Status + sourcing
  status text not null default 'submitted'
    check (status in ('submitted','reviewed','quoted','accepted','rejected','lost','won')),
  source text not null default 'asksaul-proposal-builder',
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,

  -- Services
  services text[] not null default '{}',
  industry_slug text,
  industry_label text,

  -- Business
  business_name text not null,
  business_website text,
  team_size text not null,
  revenue_range text,
  monthly_spend text,
  current_tools text[] not null default '{}',
  compliance_needs text[] not null default '{}',
  role_in_company text,
  decision_maker text
    check (decision_maker in ('yes','shared','no','unspecified')),

  -- Contact
  contact_first_name text not null,
  contact_last_name text,
  contact_email text not null,
  contact_phone text,
  preferred_contact text not null default 'email'
    check (preferred_contact in ('email','phone','text')),

  -- Timeline + budget + success
  timeline text not null,
  hard_deadline date,
  budget text,
  success_metrics text,
  notes text,

  -- Consent
  sms_consent boolean not null default false,
  marketing_sms_opt_in boolean not null default false,

  -- Scoring
  estimated_value_usd integer not null default 0,
  lead_value_tag text,
  tags text[] not null default '{}',

  -- Branch-specific data
  service_details jsonb not null default '{}'::jsonb,
  vertical_details jsonb not null default '{}'::jsonb,

  -- Side-effect tracking
  ghl_sync_status text not null default 'pending'
    check (ghl_sync_status in ('pending','synced','failed','skipped')),
  ghl_synced_at timestamptz,
  ghl_contact_id text,
  ghl_opportunity_id text,
  resend_confirmation_id text,
  resend_internal_notification_id text
);

-- Indexes for common queries
create index if not exists idx_proposals_created_at on public.proposals (created_at desc);
create index if not exists idx_proposals_status on public.proposals (status);
create index if not exists idx_proposals_contact_email on public.proposals (contact_email);
create index if not exists idx_proposals_industry_slug on public.proposals (industry_slug);
create index if not exists idx_proposals_ghl_sync_status on public.proposals (ghl_sync_status);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_proposals_updated_at on public.proposals;
create trigger trg_proposals_updated_at
  before update on public.proposals
  for each row
  execute function public.set_updated_at();

-- RLS: lock down by default. The server uses service_role which bypasses RLS.
alter table public.proposals enable row level security;
-- No public policies; all reads/writes via service_role.
