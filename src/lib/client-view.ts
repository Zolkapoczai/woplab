import type { Company } from "./types"
import type { Finding } from "./types"
import { proposals } from "@/data/proposals"

const blocked = [
  "internalNotes",
  "scores",
  "salesPriority",
  "priorityReason",
  "whyFit",
  "whyNotSelected",
  "pipelineStatus",
  "nextAction",
  "uncertainties",
] as const

export type ClientCompany = {
  id: string
  name: string
  city: string
  activity: string
  sector: string
  url: string
  domain: string
  primaryGoal: string
  clientSummary: string
  contact: Company["contact"]
  problems: string[]
}

export function toClientCompany(company: Company): ClientCompany {
  return {
    id: company.id,
    name: company.name,
    city: company.city,
    activity: company.activity,
    sector: company.sector,
    url: company.url,
    domain: company.domain,
    primaryGoal: company.primaryGoal,
    clientSummary: company.clientSummary,
    contact: company.contact,
    problems: company.problems,
  }
}

export function clientViewHasInternalFields(value: ClientCompany) {
  return blocked.some((key) => key in value)
}

export function publicFindings(items: Finding[]) {
  return items.filter((item) => item.companyId).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    severity: item.severity,
    certainty: item.certainty,
    observation: item.observation,
    evidence: item.evidence,
    businessImpact: item.businessImpact,
    recommendation: item.recommendation,
    securityClass: item.securityClass,
    url: item.url,
  }))
}

export function proposalFor(companyId: string) {
  return proposals.find((item) => item.companyId === companyId)
}
