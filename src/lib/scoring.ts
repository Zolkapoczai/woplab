import type { Company, Settings, TrafficEvidence } from "./types"

export type ScoreBreakdown = {
  key: string
  label: string
  pct: number | null
  weight: number
  points: number | null
  rationale: string
  included: boolean
}

const LABELS: Record<string, string> = {
  businessValue: "Üzleti érték és fizetőképesség",
  opportunities: "Bizonyítható fejlesztési lehetőség",
  websiteRole: "A weboldal szerepe az ügyfélszerzésben",
  traffic: "Forgalom és elérhető közönség",
  feasibility: "Megvalósíthatóság és projektméret",
  salesAccess: "Döntéshozó és értékesítési esély",
}

export function trafficIncluded(traffic: TrafficEvidence) {
  return traffic.status === "available" || traffic.status === "partial"
}

export function scoreCompany(company: Company, settings: Settings) {
  const rows: ScoreBreakdown[] = (
    [
      "businessValue",
      "opportunities",
      "websiteRole",
      "traffic",
      "feasibility",
      "salesAccess",
    ] as const
  ).map((key) => {
    const weight = settings.weights[key]
    if (key === "traffic") {
      const included = trafficIncluded(company.traffic) && typeof company.traffic.pct === "number"
      const pct = included ? company.traffic.pct! : null
      return {
        key,
        label: LABELS[key],
        pct,
        weight,
        points: pct == null ? null : (pct / 100) * weight,
        rationale: included
          ? company.traffic.rationale || company.traffic.summary
          : "Nincs megbízható nyilvános forgalmi szám. A kategória kimarad a súlyozásból, sem alacsony, sem magas értékként.",
        included,
      }
    }
    const pct = company.scores[key].pct
    return {
      key,
      label: LABELS[key],
      pct,
      weight,
      points: (pct / 100) * weight,
      rationale: company.scores[key].rationale,
      included: true,
    }
  })

  const used = rows.filter((row) => row.included && row.points != null)
  const raw = used.reduce((sum, row) => sum + (row.points || 0), 0)
  const max = used.reduce((sum, row) => sum + row.weight, 0)
  const normalized = max === 0 ? 0 : Math.round((raw / max) * 1000) / 10
  return { rows, raw, max, normalized, trafficIncluded: rows.find((row) => row.key === "traffic")?.included ?? false }
}

export function rankCompanies(companies: Company[], settings: Settings) {
  return [...companies].sort((a, b) => {
    const diff = scoreCompany(b, settings).normalized - scoreCompany(a, settings).normalized
    if (diff !== 0) return diff
    return a.name.localeCompare(b.name, "hu")
  })
}
