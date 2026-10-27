export const OBSERVED_AT = "2026-10-27"

export type Sector =
  | "Turizmus és vendéglátás"
  | "Ipar és gyártás"
  | "Építőipar és építőanyag"
  | "Autókereskedelem"
  | "Magánegészségügy"
  | "Ingatlan"
  | "Logisztika"
  | "Professzionális szolgáltatás"
  | "E-kereskedelem"
  | "Élelmiszeripar"

export type AuditStatus = "teljes" | "eloszures" | "reszleges" | "nem-elert"

export type PipelineStatus =
  | "discovered"
  | "qualified"
  | "audited"
  | "prototype-ready"
  | "presentation-ready"
  | "contacted"
  | "meeting-booked"
  | "proposal-sent"
  | "won"
  | "lost"

export type ScoreKey =
  | "businessValue"
  | "opportunities"
  | "websiteRole"
  | "feasibility"
  | "salesAccess"

export type TrafficStatus = "unavailable" | "partial" | "available"

export type FindingCategory =
  | "ux"
  | "performance"
  | "seo"
  | "accessibility"
  | "security"
  | "content"
  | "conversion"

export type Severity = "kritikus" | "magas" | "kozepes" | "alacsony" | "info"
export type Certainty = "igazolt" | "valoszinusitheto" | "hipotezis"
export type SecurityClass = "config" | "vuln-signal" | "suspicion" | "clear"

export type CategoryScore = {
  pct: number
  rationale: string
}

export type SourceRef = {
  label: string
  url: string
  note: string
}

export type TrafficEvidence = {
  status: TrafficStatus
  summary: string
  source: string
  observedAt: string
  limitations: string
  pct?: number
  rationale?: string
}

export type DecisionMaker = {
  status: "identified" | "partial" | "unknown"
  name?: string
  role?: string
  sourceUrl?: string
  note: string
}

export type Company = {
  id: string
  name: string
  legalName?: string
  domain: string
  url: string
  sector: Sector
  activity: string
  city: string
  country: "Magyarország"
  sizeSignals: string[]
  traffic: TrafficEvidence
  primaryGoal: string
  problems: string[]
  sources: SourceRef[]
  businessRelevance: string
  projectBand: { min: number; max: number; note: string }
  decisionMaker: DecisionMaker
  whyFit: string
  whyNotSelected?: string
  uncertainties: string[]
  scores: Record<ScoreKey, CategoryScore>
  auditStatus: AuditStatus
  selected: boolean
  salesPriority?: number
  priorityReason?: string
  pipelineStatus: PipelineStatus
  nextAction: string
  internalNotes: string
  clientSummary: string
  contact: { address?: string; phone?: string; email?: string }
}

export type Finding = {
  id: string
  companyId: string
  category: FindingCategory
  title: string
  severity: Severity
  certainty: Certainty
  priority: 1 | 2 | 3
  observation: string
  evidence: string
  method: string
  observedAt: string
  url: string
  businessImpact: string
  recommendation: string
  securityClass?: SecurityClass
}

export type RateKey = "design" | "dev" | "content" | "pm" | "qa"
export type CostBucket = "delivery" | "external" | "license"

export type ProposalLine = {
  id: string
  bucket: CostBucket
  label: string
  detail: string
  hours: number
  rateKey: RateKey
  included: boolean
}

export type ProposalSeed = {
  companyId: string
  goal: string
  pages: string[]
  lines: ProposalLine[]
  discountPct: number
  maintenanceMonthly: number
  maintenanceNote: string
  prepAuditHours: number
  prepPrototypeHours: number
  assumptions: string[]
  exclusions: string[]
  milestones: { name: string; weeks: string; detail: string }[]
  clientMaterials: string[]
  integrations: string[]
  cms: string
  migration: string
  testing: string
  hypotheses: string[]
}

export type Settings = {
  weights: Record<ScoreKey | "traffic", number>
  sellRates: Record<RateKey, number>
  internalRates: Record<RateKey, number>
  vatRate: number
  currency: "HUF"
  dataUpdatedAt: string
  pricingNotes: string[]
  securityRules: string[]
  auditCriteria: string[]
  researchSources: string[]
}

export type PipelinePatch = {
  status?: PipelineStatus
  nextAction?: string
  note?: string
}

export type ProposalPatch = {
  discountPct?: number
  maintenanceEnabled?: boolean
  maintenanceMonthly?: number
  lines?: Record<string, { hours?: number; rate?: number; included?: boolean }>
}

export type CompanyPatch = {
  internalNotes?: string
  clientSummary?: string
  nextAction?: string
}

export type PersistedState = {
  version: 1
  settings?: Partial<Settings> & {
    weights?: Partial<Settings["weights"]>
    sellRates?: Partial<Settings["sellRates"]>
    internalRates?: Partial<Settings["internalRates"]>
  }
  pipeline?: Record<string, PipelinePatch>
  proposals?: Record<string, ProposalPatch>
  companies?: Record<string, CompanyPatch>
}
