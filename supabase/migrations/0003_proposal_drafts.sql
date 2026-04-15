-- Saul iterates on quote drafts; one proposal can have many drafts
-- Only one draft per proposal is ever 'sent'; others are 'superseded'.

create table if not exists public.proposal_drafts (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  version integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text not null default 'saul'
    check (created_by in ('saul','gregory')),

  status text not null default 'draft'
    check (status in ('draft','pending_approval','approved','sent','superseded')),

  -- Quote shape
  scope_summary text,
  deliverables jsonb not null default '[]'::jsonb,
  price_usd integer,
  price_model text
    check (price_model in ('fixed','retainer','hybrid')),
  timeline_weeks integer,
  terms text,

  -- Rendered bodies
  markdown_body text,
  html_body text,

  -- Send metadata
  approved_at timestamptz,
  approved_by text,
  sent_at timestamptz,
  sent_to_email text,
  resend_message_id text,

  unique (proposal_id, version)
);

create index if not exists idx_proposal_drafts_proposal_id on public.proposal_drafts (proposal_id);
create index if not exists idx_proposal_drafts_status on public.proposal_drafts (status);
create index if not exists idx_proposal_drafts_created_at on public.proposal_drafts (created_at desc);

drop trigger if exists trg_proposal_drafts_updated_at on public.proposal_drafts;
create trigger trg_proposal_drafts_updated_at
  before update on public.proposal_drafts
  for each row
  execute function public.set_updated_at();

alter table public.proposal_drafts enable row level security;
-- service_role only
