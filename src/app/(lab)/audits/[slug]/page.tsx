"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useLab } from "@/components/lab/provider"
import { labAudits } from "@/data/lighthouse"
import { CATEGORY_LABEL, CERTAINTY_LABEL, SECURITY_LABEL, SEVERITY_LABEL } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import type { FindingCategory } from "@/lib/types"

const order: FindingCategory[] = ["ux", "content", "conversion", "seo", "accessibility", "performance", "security"]

export default function AuditDetailPage() {
  const params = useParams<{ slug: string }>()
  const { companies, findings } = useLab()
  const company = companies.find((item) => item.id === params.slug)
  const [category, setCategory] = useState<FindingCategory | "mind">("mind")
  if (!company) return <p>Nincs ilyen audit.</p>
  const own = findings.filter((item) => item.companyId === company.id && (category === "mind" || item.category === category))
  const security = findings.filter((item) => item.companyId === company.id && item.category === "security")
  const lab = labAudits.find((item) => item.companyId === company.id)

  return (
    <article className="space-y-6">
      <header>
        <p className="text-xs text-muted-foreground">
          <Link href="/audits" className="hover:underline">Auditok</Link> / {company.name}
        </p>
        <h1 className="font-display mt-2 text-4xl">{company.name} audit</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Megfigyelés napja: 2026. október 27. Az automatikus HTML-jelek és a kézi olvasás külön van jelölve a módszer mezőben. Ez nem teljes WCAG-tanúsítvány.
        </p>
      </header>
      {lab ? (
        <section className="rounded-xl border border-border bg-card p-4 text-sm leading-6">
          <h2 className="font-display text-xl">Lighthouse mobil labor</h2>
          <p className="mt-2 text-muted-foreground">
            Mérés: {lab.fetchedAt}. Fejlesztői szimuláció, nem a látogatók CrUX adata. A PageSpeed API ezen a napon 429-et adott.
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Teljesítmény" value={String(lab.performance)} />
            <Metric label="Akadálymentesség" value={String(lab.accessibility)} />
            <Metric label="SEO" value={String(lab.seo)} />
            <Metric label="Best practices" value={String(lab.bestPractices)} />
            <Metric label="LCP" value={lab.lcp} />
            <Metric label="FCP" value={lab.fcp} />
            <Metric label="TBT" value={lab.tbt} />
            <Metric label="CLS" value={lab.cls} />
          </dl>
          <p className="mt-3">{lab.reading}</p>
        </section>
      ) : company.id === "transsped" ? (
        <p className="text-sm leading-6 text-muted-foreground">
          A Trans-Spedhez nem futott Lighthouse. A hiányos tanúsítványlánc miatt a szigorú mérő kliens nem a látogatói élményt mérné. A PSI API 429-et adott, CrUX adat nincs.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <FilterButton current={category} value="mind" set={setCategory} label="Mind" />
        {order.map((item) => (
          <FilterButton key={item} current={category} value={item} set={setCategory} label={CATEGORY_LABEL[item]} />
        ))}
      </div>
      {category === "mind" || category === "security" ? (
        <section className="rounded-xl border border-border bg-muted/40 p-4 text-sm leading-6">
          <h2 className="font-display text-xl">Biztonsági összkép</h2>
          <p className="mt-2">Az elvégzett passzív ellenőrzés nem igazolt kihasználható sérülékenységet. A konfigurációs rések ettől még javítandók.</p>
          <ul className="mt-3 space-y-1">
            {security.map((item) => (
              <li key={item.id}>
                {SECURITY_LABEL[item.securityClass || "clear"]}: {item.title}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="space-y-3">
        {own.map((item) => (
          <details key={item.id} open={item.priority === 1} className="rounded-xl border border-border bg-card p-4">
            <summary className="cursor-pointer text-base font-medium">{item.title}</summary>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{CATEGORY_LABEL[item.category]}</Badge>
              <Badge variant="outline">Súlyosság: {SEVERITY_LABEL[item.severity]}</Badge>
              <Badge variant="outline">Bizonyosság: {CERTAINTY_LABEL[item.certainty]}</Badge>
              <Badge variant="outline">Prioritás {item.priority}</Badge>
              {item.securityClass && <Badge variant="secondary">{SECURITY_LABEL[item.securityClass]}</Badge>}
            </div>
            <dl className="mt-4 space-y-3 text-sm leading-6">
              <div>
                <dt className="font-medium">Megfigyelés</dt>
                <dd>{item.observation}</dd>
              </div>
              <div>
                <dt className="font-medium">Bizonyíték</dt>
                <dd>{item.evidence}</dd>
              </div>
              <div>
                <dt className="font-medium">Módszer és nap</dt>
                <dd>
                  {item.method} {item.observedAt}.{" "}
                  <a className="hover:underline" href={item.url}>
                    Érintett URL
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium">Üzleti hatás</dt>
                <dd>{item.businessImpact}</dd>
              </div>
              <div>
                <dt className="font-medium">Javaslat</dt>
                <dd>{item.recommendation}</dd>
              </div>
            </dl>
          </details>
        ))}
      </div>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl">{value}</dd>
    </div>
  )
}

function FilterButton({
  current,
  value,
  set,
  label,
}: {
  current: string
  value: FindingCategory | "mind"
  set: (value: FindingCategory | "mind") => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => set(value)}
      className={`rounded-full border px-3 py-1 text-sm ${current === value ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
      aria-pressed={current === value}
    >
      {label}
    </button>
  )
}
