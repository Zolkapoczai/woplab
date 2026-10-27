"use client"

import Link from "next/link"
import { companies as seed } from "@/data/companies"
import { findings } from "@/data/findings"
import { useLab } from "@/components/lab/provider"
import { scoreCompany, rankCompanies } from "@/lib/scoring"
import { priceProposal } from "@/lib/pricing"
import { hufCompact } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { companies, settings, proposals, proposalPatch } = useLab()
  const researched = companies.length
  const audited = companies.filter((item) => item.auditStatus === "teljes").length
  const selected = rankCompanies(
    companies.filter((item) => item.selected),
    settings,
  )
  const prototypes = selected.length
  const priced = proposals.map((seed) => priceProposal(seed, settings, proposalPatch(seed.companyId)))
  const offerNet = priced.reduce((sum, item) => sum + item.oneTimeNet, 0)
  const internal = priced.reduce((sum, item) => sum + item.internalDelivery + item.internalPrep, 0)
  const care = priced.reduce((sum, item) => sum + item.maintenanceMonthly, 0)
  const next = [...selected].sort((a, b) => (a.salesPriority || 99) - (b.salesPriority || 99)).slice(0, 5)

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Belső műhely</p>
        <h1 className="font-display mt-2 text-4xl leading-tight">Tíz magyar weboldal, tíz bemutatható ajánlat.</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          A számok a 2026. október 27-i nyilvántartásból jönnek. Forgalmi látogatószám nincs a képletben, mert megbízható nyilvános adat sem a cégek, sem a külső források oldalán nem volt.
        </p>
      </header>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Vizsgált cég" value={String(researched)} note={`${seed.length} rekord a nyilvántartásban`} />
        <Kpi label="Teljes audit" value={String(audited)} note={`${findings.length} megállapítás`} />
        <Kpi label="Kész prototípus" value={String(prototypes)} note="Mind a tíz shortlist céghez" />
        <Kpi label="Ajánlatok nettó összege" value={hufCompact(offerNet)} note="Bekapcsolt tételek, kedvezmény után" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>A tíz kiválasztott, pontszám szerint</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="divide-y divide-border">
              {selected.map((company, index) => {
                const score = scoreCompany(company, settings)
                return (
                  <li key={company.id} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
                    <div>
                      <Link href={`/companies/${company.id}`} className="font-medium hover:underline">
                        {index + 1}. {company.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{company.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl">{score.normalized.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">
                        {score.raw.toFixed(1)} / {score.max} pont
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Következő teendők</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {next.map((company) => (
                <div key={company.id}>
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/pipeline`} className="text-sm font-medium hover:underline">
                      {company.salesPriority}. {company.name}
                    </Link>
                    <Badge variant="outline">{company.pipelineStatus}</Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{company.nextAction}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Érték, nem ígéret</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-6">
              <p>Ügyfélnek szóló nettó ajánlatok összege: {hufCompact(offerNet)}.</p>
              <p>Becsült belső kivitelezés és előkészítés: {hufCompact(internal)}.</p>
              <p>Opcionális havi üzemeltetés, ha mind a tízet bekérnék: {hufCompact(care)} / hó.</p>
              <p className="text-muted-foreground">Az áfa külön sor. Bevételnövekedést a labor nem állít.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-3xl">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  )
}
