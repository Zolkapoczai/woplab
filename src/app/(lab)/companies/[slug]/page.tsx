"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useLab } from "@/components/lab/provider"
import { scoreCompany } from "@/lib/scoring"
import { AUDIT_LABEL, CATEGORY_LABEL, SCORE_LABEL, hufCompact } from "@/lib/format"
import { priceProposal } from "@/lib/pricing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CompanyPage() {
  const params = useParams<{ slug: string }>()
  const { companies, settings, findings: allFindings, proposals, proposalPatch, updateCompany } = useLab()
  const company = companies.find((item) => item.id === params.slug)
  if (!company) return <p>Nincs ilyen cég a nyilvántartásban.</p>
  const score = scoreCompany(company, settings)
  const ownFindings = allFindings.filter((item) => item.companyId === company.id)
  const seed = proposals.find((item) => item.companyId === company.id)
  const priced = seed ? priceProposal(seed, settings, proposalPatch(company.id)) : null
  const top = [...ownFindings].sort((a, b) => a.priority - b.priority).slice(0, 5)

  return (
    <article className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{company.sector}</p>
          <h1 className="font-display text-4xl">{company.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{company.activity}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {company.selected && (
            <>
              <Button asChild>
                <Link href={`/p/${company.id}`}>Prototípus</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/present/${company.id}`}>Ügyfélprezentáció</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/proposals/${company.id}`}>Ajánlat</Link>
              </Button>
            </>
          )}
          <Button asChild variant="outline">
            <Link href={`/audits/${company.id}`}>Audit</Link>
          </Button>
        </div>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        <Fact title="Eredeti oldal" body={<a className="hover:underline" href={company.url}>{company.domain}</a>} />
        <Fact title="Audit" body={AUDIT_LABEL[company.auditStatus]} />
        <Fact title="Pontszám" body={`${score.normalized.toFixed(1)} / 100`} />
      </section>
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Block title="Összefoglaló">
            <p>{company.clientSummary}</p>
            <p className="mt-3">{company.businessRelevance}</p>
          </Block>
          <Block title="Méretjelek">
            <ul className="list-disc space-y-1 pl-5">
              {company.sizeSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>
          <Block title="Forgalom">
            <p>{company.traffic.summary}</p>
            <p className="mt-2 text-muted-foreground">{company.traffic.limitations}</p>
            <p className="mt-2 text-xs">Forrás: {company.traffic.source}. Nap: {company.traffic.observedAt}.</p>
          </Block>
          <Block title="Források">
            <ul className="space-y-2">
              {company.sources.map((source) => (
                <li key={source.url + source.label}>
                  <a className="font-medium hover:underline" href={source.url}>
                    {source.label}
                  </a>
                  <span className="text-muted-foreground"> — {source.note}</span>
                </li>
              ))}
            </ul>
          </Block>
        </div>
        <div className="space-y-6">
          <Block title="Pontozás">
            <ul className="space-y-3">
              {score.rows.map((row) => (
                <li key={row.key}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span>{SCORE_LABEL[row.key] || row.label}</span>
                    <span>{row.included && row.points != null ? `${row.points.toFixed(1)} / ${row.weight}` : "kimarad"}</span>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">{row.rationale}</p>
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Döntéshozó">
            <p>{company.decisionMaker.name ? `${company.decisionMaker.name}${company.decisionMaker.role ? `, ${company.decisionMaker.role}` : ""}` : "Név szerint nem azonosított."}</p>
            <p className="mt-2 text-muted-foreground">{company.decisionMaker.note}</p>
          </Block>
          <Block title="Projektérték">
            <p>
              {company.projectBand.max
                ? `${hufCompact(company.projectBand.min)} – ${hufCompact(company.projectBand.max)}`
                : "Nincs becslés"}
            </p>
            <p className="mt-2 text-muted-foreground">{company.projectBand.note}</p>
            {priced && <p className="mt-2">Részletes ajánlat nettója most: {hufCompact(priced.oneTimeNet)}.</p>}
          </Block>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <Block title="Megfigyelt problémák">
          <ul className="list-disc space-y-1 pl-5">
            {company.problems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {top.length > 0 && (
            <ul className="mt-4 space-y-2">
              {top.map((item) => (
                <li key={item.id} className="rounded-lg border border-border p-3">
                  <Badge variant="outline">{CATEGORY_LABEL[item.category]}</Badge>
                  <p className="mt-2 font-medium">{item.title}</p>
                </li>
              ))}
            </ul>
          )}
        </Block>
        <Block title="Bizonytalanság és belső jegyzet">
          <ul className="list-disc space-y-1 pl-5">
            {company.uncertainties.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {company.whyNotSelected && <p className="mt-3">Miért nem került a tízesbe: {company.whyNotSelected}</p>}
          <p className="mt-3">Miért illik: {company.whyFit}</p>
          <form className="mt-4 space-y-3" onSubmit={(event) => event.preventDefault()}>
            <div className="space-y-1">
              <Label htmlFor="notes">Belső jegyzet</Label>
              <Textarea
                id="notes"
                value={company.internalNotes}
                onChange={(event) => updateCompany(company.id, { internalNotes: event.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Ez a jegyzet a böngészőben marad, és nem jelenik meg az ügyfélprezentáción.</p>
          </form>
        </Block>
      </section>
      <Block title="Következő saleslépés">
        <p>{company.nextAction}</p>
        {company.priorityReason && <p className="mt-2 text-muted-foreground">{company.priorityReason}</p>}
      </Block>
    </article>
  )
}

function Fact({ title, body }: { title: string; body: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-1 text-lg">{body}</p>
    </div>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 text-sm leading-6">{children}</div>
    </section>
  )
}
