export interface Industry {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  bullets: string[];
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "msp",
    name: "Managed IT Services (MSPs)",
    shortDescription:
      "Replace referral-dependent growth with a 24/7 outbound engine. Lead gen, enrichment, multi-channel outreach, and pipeline analytics built for recurring-revenue IT businesses.",
    longDescription:
      "Most MSPs grow on referrals and prayer. Saul replaces that with a closed-loop outbound engine that runs while you sleep. We wire up lead enrichment, multi-channel outreach, and pipeline visibility so your recurring revenue compounds instead of stalling.",
    bullets: [
      "Outbound engine across email, LinkedIn, and SMS",
      "Lead enrichment and scoring tied to your ICP",
      "Pipeline analytics that plug into ConnectWise or Autotask",
    ],
  },
  {
    slug: "property-mgmt",
    name: "Property Management",
    shortDescription:
      "Automate tenant acquisition, leasing outreach, and maintenance coordination. Stop doing BD off the side of your desk.",
    longDescription:
      "Property managers juggle tenants, owners, maintenance, and growth at the same time. Saul automates the parts that do not require human judgment, so you can focus on closing the portfolios that actually move your business forward.",
    bullets: [
      "Tenant acquisition and leasing follow-up on autopilot",
      "Maintenance request triage and coordination",
      "Owner reporting and BD outreach in one system",
    ],
  },
  {
    slug: "home-services",
    name: "Home Services (HVAC, Plumbing, Pool, Roofing)",
    shortDescription:
      "Answer leads 24/7. Automate follow-up. Build a website that actually converts. AI-powered scheduling and review management.",
    longDescription:
      "Home services leads go cold fast. Saul answers every inquiry in minutes, qualifies it, books it, and chases the review after the job. Paired with a conversion-focused website, it is the closest thing to a full marketing and ops team in a box.",
    bullets: [
      "24/7 AI answering and intake",
      "Automated scheduling and job reminders",
      "Review requests and reputation management",
    ],
  },
  {
    slug: "title-insurance",
    name: "Title Insurance",
    shortDescription:
      "Automate outreach to real estate agents and loan officers. Track referral partnerships. Build pipeline visibility across offices.",
    longDescription:
      "Title is a referral business. Saul turns that into a system. We build the outreach engine to agents and loan officers, track partnership activity across offices, and give you the pipeline visibility you have been trying to pull out of spreadsheets for years.",
    bullets: [
      "Agent and loan officer outreach sequences",
      "Referral partnership tracking",
      "Multi-office pipeline and KPI dashboards",
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services (Legal, Consulting, Accounting)",
    shortDescription:
      "Client intake automation. Follow-up sequences. CRM that actually gets used. Free your team from the admin grind.",
    longDescription:
      "Professional services firms lose hours to intake forms, follow-ups, and CRM data entry. Saul takes the admin off your team's plate so billable people stay billable and the pipeline actually gets worked.",
    bullets: [
      "Structured client intake and document collection",
      "Follow-up sequences for consults and proposals",
      "CRM that surfaces what to do next, not what to remember",
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    shortDescription:
      "Lead nurture, listing alerts, showing coordination, and review management. Built for brokerages and teams that need to move fast.",
    longDescription:
      "Real estate teams win or lose on response time. Saul replies in seconds, routes the right lead to the right agent, schedules the showing, and keeps the transaction moving without anyone chasing their tail in a group text.",
    bullets: [
      "Instant lead response across SMS, email, and WhatsApp",
      "Showing coordination and transaction milestones",
      "Post-close review and referral sequences",
    ],
  },
  {
    slug: "startup",
    name: "Sales-Led Startups",
    shortDescription:
      "Replace your fragmented tool stack with a closed-loop GTM engine. Lead gen, outreach, reply capture, and analytics in one system. Built for founder-led sales teams scaling outbound.",
    longDescription:
      "Founder-led sales with a duct-taped stack is the default state of most early startups. Saul consolidates lead gen, outreach, reply capture, and analytics into a closed-loop system so your next five hires are about scaling what works, not rebuilding the plumbing.",
    bullets: [
      "Lead gen and enrichment tuned to ICP",
      "Multi-channel outreach with reply capture",
      "Closed-loop analytics from first touch to booked demo",
    ],
  },
  {
    slug: "pe-portfolio",
    name: "PE Portfolio Companies",
    shortDescription:
      "Standardized GTM playbook deployed across your portfolio. One system, multiple entities, consistent reporting. AI-native from day one.",
    longDescription:
      "Deploying the same GTM motion across a portfolio is hard when every company has a different stack. Saul gives you one system, one playbook, and consistent reporting across every entity, all AI-native from day one.",
    bullets: [
      "Standardized GTM stack deployable across the portfolio",
      "Consistent KPIs and rollup reporting",
      "AI-native workflows without legacy tool sprawl",
    ],
  },
];
