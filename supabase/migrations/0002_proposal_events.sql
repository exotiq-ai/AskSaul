-- Audit log for every state change on a proposal

create table if not exists public.proposal_events (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  created_at timestamptz not null default now(),
  event_type text not null
    check (event_type in (
      'submitted',
      'ghl_synced',
      'ghl_failed',
      'ghl_retry_attempted',
      'email_sent',
      'email_failed',
      'email_opened',
      'email_clicked',
      'reviewed_by_saul',
      'quote_drafted',
      'quote_approved',
      'quote_sent',
      'quote_viewed',
      'quote_accepted',
      'quote_rejected',
      'status_changed',
      'note_added'
    )),
  actor text not null default 'system'
    check (actor in ('system','saul','gregory','prospect')),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_proposal_events_proposal_id on public.proposal_events (proposal_id);
create index if not exists idx_proposal_events_created_at on public.proposal_events (created_at desc);
create index if not exists idx_proposal_events_event_type on public.proposal_events (event_type);

alter table public.proposal_events enable row level security;
-- service_role only
