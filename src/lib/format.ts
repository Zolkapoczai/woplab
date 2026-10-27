export function huf(value: number, digits = 0) {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}

export function hufCompact(value: number) {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const millions = value / 1_000_000
    const text = new Intl.NumberFormat("hu-HU", {
      maximumFractionDigits: millions >= 10 ? 1 : 2,
      minimumFractionDigits: 0,
    }).format(millions)
    return `${text} M Ft`
  }
  return huf(value)
}

export const PIPELINE_LABEL: Record<string, string> = {
  discovered: "Discovered",
  qualified: "Qualified",
  audited: "Audited",
  "prototype-ready": "Prototype ready",
  "presentation-ready": "Presentation ready",
  contacted: "Contacted",
  "meeting-booked": "Meeting booked",
  "proposal-sent": "Proposal sent",
  won: "Won",
  lost: "Lost",
}

export const CATEGORY_LABEL: Record<string, string> = {
  ux: "UX/UI",
  performance: "Teljesítmény",
  seo: "SEO",
  accessibility: "Akadálymentesség",
  security: "Biztonság",
  content: "Tartalom",
  conversion: "Konverzió",
}

export const SEVERITY_LABEL: Record<string, string> = {
  kritikus: "Kritikus",
  magas: "Magas",
  kozepes: "Közepes",
  alacsony: "Alacsony",
  info: "Információ",
}

export const CERTAINTY_LABEL: Record<string, string> = {
  igazolt: "Igazolt",
  valoszinusitheto: "Valószínűsíthető",
  hipotezis: "Hipotézis",
}

export const SECURITY_LABEL: Record<string, string> = {
  config: "Igazolt konfigurációs probléma",
  "vuln-signal": "Dokumentált sérülékenységi jel",
  suspicion: "További vizsgálatot igénylő gyanú",
  clear: "Nem észlelt probléma az elvégzett ellenőrzésen",
}

export const AUDIT_LABEL: Record<string, string> = {
  teljes: "Teljes audit",
  eloszures: "Előszűrés",
  reszleges: "Részleges",
  "nem-elert": "Nem elérhető",
}

export const SCORE_LABEL: Record<string, string> = {
  businessValue: "Üzleti érték",
  opportunities: "Fejlesztési lehetőség",
  websiteRole: "Weboldal szerepe",
  traffic: "Forgalom",
  feasibility: "Megvalósíthatóság",
  salesAccess: "Értékesítési esély",
}
