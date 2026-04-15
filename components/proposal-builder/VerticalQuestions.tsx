"use client";

import { useFormContext } from "react-hook-form";
import {
  MSP_PSA_OPTIONS,
  TICKET_VOLUME_OPTIONS,
  PORTFOLIO_TYPE_OPTIONS,
  HOME_SERVICE_TRADE_OPTIONS,
  JOB_VOLUME_OPTIONS,
  STARTUP_STAGE_OPTIONS,
  INDUSTRY_LABEL_TO_SLUG,
  VERTICAL_SLUGS_WITH_QUESTIONS,
  type ProposalFormData,
  type VerticalSlug,
} from "@/lib/validation";

const PSA_LABELS: Record<string, string> = {
  connectwise: "ConnectWise",
  autotask: "Autotask",
  halopsa: "HaloPSA",
  syncro: "Syncro",
  none: "None",
  other: "Other",
};

const TICKET_VOLUME_LABELS: Record<string, string> = {
  "under-100": "Under 100",
  "100-500": "100 to 500",
  "500-1k": "500 to 1K",
  "1k-5k": "1K to 5K",
  "5k-plus": "5K+",
};

const PORTFOLIO_LABELS: Record<string, string> = {
  "single-family": "Single family",
  multifamily: "Multifamily",
  mixed: "Mixed portfolio",
  commercial: "Commercial",
  "vacation-rental": "Vacation rental",
};

const TRADE_LABELS: Record<string, string> = {
  hvac: "HVAC",
  plumbing: "Plumbing",
  pool: "Pool",
  roofing: "Roofing",
  electrical: "Electrical",
  landscaping: "Landscaping",
  other: "Other",
};

const JOB_VOLUME_LABELS: Record<string, string> = {
  "under-50": "Under 50 / mo",
  "50-200": "50 to 200 / mo",
  "200-500": "200 to 500 / mo",
  "500-1k": "500 to 1K / mo",
  "1k-plus": "1K+ / mo",
};

const STARTUP_STAGE_LABELS: Record<string, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b-plus": "Series B+",
  bootstrapped: "Bootstrapped",
  profitable: "Profitable",
};

function Toggle({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60
        ${
          selected
            ? "border-cyan bg-cyan/10 text-cyan"
            : "border-wire bg-graphite text-slate hover:border-cyan/30 hover:text-cloud"
        }
      `}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-cloud mb-2">{children}</p>;
}

function NumberInput({
  name,
  placeholder,
}: {
  name: keyof ProposalFormData;
  placeholder?: string;
}) {
  const { register } = useFormContext<ProposalFormData>();
  return (
    <input
      type="number"
      min={0}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60"
      {...register(name as never)}
    />
  );
}

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | undefined;
  onChange: (v: boolean | undefined) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Toggle
        selected={value === true}
        onClick={() => onChange(value === true ? undefined : true)}
      >
        Yes
      </Toggle>
      <Toggle
        selected={value === false}
        onClick={() => onChange(value === false ? undefined : false)}
      >
        No
      </Toggle>
    </div>
  );
}

function MspBlock() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const psa = watch("mspPsaSystem");
  const vol = watch("mspTicketVolume");
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>PSA system</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MSP_PSA_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={psa === o}
              onClick={() => setValue("mspPsaSystem", psa === o ? undefined : o)}
            >
              {PSA_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Monthly ticket volume</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TICKET_VOLUME_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={vol === o}
              onClick={() => setValue("mspTicketVolume", vol === o ? undefined : o)}
            >
              {TICKET_VOLUME_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Client count</FieldLabel>
          <NumberInput name="mspClientCount" placeholder="e.g. 45" />
        </div>
        <div>
          <FieldLabel>% recurring revenue</FieldLabel>
          <NumberInput name="mspRecurringRevenuePct" placeholder="e.g. 70" />
        </div>
      </div>
    </div>
  );
}

function PropertyBlock() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const portfolio = watch("propertyPortfolioType");
  const tenantPortal = watch("propertyTenantPortalNeeded");
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Door count</FieldLabel>
          <NumberInput name="propertyDoorCount" placeholder="e.g. 350" />
        </div>
        <div>
          <FieldLabel>Tenant portal needed?</FieldLabel>
          <YesNoToggle
            value={tenantPortal}
            onChange={(v) => setValue("propertyTenantPortalNeeded", v)}
          />
        </div>
      </div>
      <div>
        <FieldLabel>Portfolio type</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PORTFOLIO_TYPE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={portfolio === o}
              onClick={() =>
                setValue(
                  "propertyPortfolioType",
                  portfolio === o ? undefined : o,
                )
              }
            >
              {PORTFOLIO_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeServicesBlock() {
  const { watch, setValue, register } = useFormContext<ProposalFormData>();
  const trades = watch("homeServiceTrades") ?? [];
  const vol = watch("homeServiceJobVolume");

  function toggleTrade(t: (typeof HOME_SERVICE_TRADE_OPTIONS)[number]) {
    if (trades.includes(t)) {
      setValue(
        "homeServiceTrades",
        trades.filter((x) => x !== t),
      );
    } else {
      setValue("homeServiceTrades", [...trades, t]);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Trades you serve</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {HOME_SERVICE_TRADE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={trades.includes(o)}
              onClick={() => toggleTrade(o)}
            >
              {TRADE_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Jobs per month</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {JOB_VOLUME_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={vol === o}
              onClick={() =>
                setValue("homeServiceJobVolume", vol === o ? undefined : o)
              }
            >
              {JOB_VOLUME_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Dispatching tool <span className="text-dim font-normal">(optional)</span></FieldLabel>
        <input
          type="text"
          placeholder="e.g. ServiceTitan, Jobber, Housecall Pro"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60"
          {...register("homeServiceDispatchTool")}
        />
      </div>
    </div>
  );
}

function TitleBlock() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Deals per month</FieldLabel>
        <NumberInput name="titleDealsPerMonth" placeholder="e.g. 80" />
      </div>
      <div>
        <FieldLabel>Number of offices</FieldLabel>
        <NumberInput name="titleOfficeCount" placeholder="e.g. 3" />
      </div>
    </div>
  );
}

function ProfessionalBlock() {
  const { watch, setValue, register } = useFormContext<ProposalFormData>();
  const billable = watch("profBillableHoursTracked");
  const portal = watch("profClientPortalNeeded");
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Practice area</FieldLabel>
        <input
          type="text"
          placeholder="e.g. estate planning, tax, management consulting"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60"
          {...register("profPracticeArea")}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Billable hours tracked?</FieldLabel>
          <YesNoToggle
            value={billable}
            onChange={(v) => setValue("profBillableHoursTracked", v)}
          />
        </div>
        <div>
          <FieldLabel>Client portal needed?</FieldLabel>
          <YesNoToggle
            value={portal}
            onChange={(v) => setValue("profClientPortalNeeded", v)}
          />
        </div>
      </div>
    </div>
  );
}

const REAL_ESTATE_TEAM_LABELS: Record<string, string> = {
  brokerage: "Brokerage",
  team: "Team",
  "solo-agent": "Solo agent",
  developer: "Developer",
};

function RealEstateBlock() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const teamType = watch("realEstateTeamType");
  const mls = watch("realEstateMlsIntegrationNeeded");
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Team type</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(REAL_ESTATE_TEAM_LABELS) as Array<keyof typeof REAL_ESTATE_TEAM_LABELS>).map((o) => (
            <Toggle
              key={o}
              selected={teamType === o}
              onClick={() =>
                setValue(
                  "realEstateTeamType",
                  teamType === o ? undefined : (o as never),
                )
              }
            >
              {REAL_ESTATE_TEAM_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Agent count</FieldLabel>
          <NumberInput name="realEstateAgentCount" placeholder="e.g. 22" />
        </div>
        <div>
          <FieldLabel>MLS integration needed?</FieldLabel>
          <YesNoToggle
            value={mls}
            onChange={(v) => setValue("realEstateMlsIntegrationNeeded", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StartupBlock() {
  const { watch, setValue, register } = useFormContext<ProposalFormData>();
  const stage = watch("startupStage");
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Stage</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STARTUP_STAGE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={stage === o}
              onClick={() => setValue("startupStage", stage === o ? undefined : o)}
            >
              {STARTUP_STAGE_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Runway (months)</FieldLabel>
          <NumberInput name="startupRunwayMonths" placeholder="e.g. 14" />
        </div>
        <div>
          <FieldLabel>Key metric <span className="text-dim font-normal">(optional)</span></FieldLabel>
          <input
            type="text"
            placeholder="e.g. MRR growth, CAC, activation"
            className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60"
            {...register("startupKeyMetric")}
          />
        </div>
      </div>
    </div>
  );
}

function PePortfolioBlock() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const unified = watch("peUnifiedReportingRequired");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Portfolio company count</FieldLabel>
        <NumberInput name="pePortfolioCompanyCount" placeholder="e.g. 8" />
      </div>
      <div>
        <FieldLabel>Unified reporting required?</FieldLabel>
        <YesNoToggle
          value={unified}
          onChange={(v) => setValue("peUnifiedReportingRequired", v)}
        />
      </div>
    </div>
  );
}

const VERTICAL_HEADINGS: Record<VerticalSlug, string> = {
  msp: "MSP-specific",
  "property-mgmt": "Property management specifics",
  "home-services": "Home services specifics",
  "title-insurance": "Title insurance specifics",
  "professional-services": "Professional services specifics",
  "real-estate": "Real estate specifics",
  startup: "Startup specifics",
  "pe-portfolio": "PE portfolio specifics",
};

export default function VerticalQuestions() {
  const { watch } = useFormContext<ProposalFormData>();
  const industry = watch("industry");
  const slug = INDUSTRY_LABEL_TO_SLUG[industry ?? ""] ?? "";
  const isVertical = (VERTICAL_SLUGS_WITH_QUESTIONS as readonly string[]).includes(slug);
  if (!isVertical) return null;

  const verticalSlug = slug as VerticalSlug;

  return (
    <div className="bg-graphite/60 border border-wire rounded-xl p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan mb-3">
        {VERTICAL_HEADINGS[verticalSlug]}
      </p>
      {verticalSlug === "msp" && <MspBlock />}
      {verticalSlug === "property-mgmt" && <PropertyBlock />}
      {verticalSlug === "home-services" && <HomeServicesBlock />}
      {verticalSlug === "title-insurance" && <TitleBlock />}
      {verticalSlug === "professional-services" && <ProfessionalBlock />}
      {verticalSlug === "real-estate" && <RealEstateBlock />}
      {verticalSlug === "startup" && <StartupBlock />}
      {verticalSlug === "pe-portfolio" && <PePortfolioBlock />}
    </div>
  );
}
