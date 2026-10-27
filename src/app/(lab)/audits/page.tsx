"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useLab } from "@/components/lab/provider"
import { CATEGORY_LABEL, CERTAINTY_LABEL, SEVERITY_LABEL } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FindingCategory, Severity } from "@/lib/types"

export default function AuditsPage() {
  const { findings, companies } = useLab()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<FindingCategory | "mind">("mind")
  const [severity, setSeverity] = useState<Severity | "mind">("mind")
  const [companyId, setCompanyId] = useState("mind")
  const rows = useMemo(() => {
    return findings.filter((item) => {
      if (category !== "mind" && item.category !== category) return false
      if (severity !== "mind" && item.severity !== severity) return false
      if (companyId !== "mind" && item.companyId !== companyId) return false
      const blob = `${item.title} ${item.observation} ${item.evidence}`.toLowerCase()
      return !query || blob.includes(query.toLowerCase())
    })
  }, [category, companyId, findings, query, severity])
  const audited = companies.filter((item) => item.auditStatus === "teljes")

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Auditok</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {findings.length} megállapítás a tíz teljes audithoz. A súlyosság és a bizonyosság külön mező. Ez nem tanúsítvány és nem behatolási teszt.
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        {audited.map((company) => (
          <Link key={company.id} href={`/audits/${company.id}`} className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted">
            {company.name}
          </Link>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="aq">Keresés a megállapításokban</Label>
          <Input id="aq" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cat">Kategória</Label>
          <select id="cat" className="h-8 w-full rounded-lg border bg-card px-2 text-sm" value={category} onChange={(event) => setCategory(event.target.value as FindingCategory | "mind")}>
            <option value="mind">Mind</option>
            {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sev">Súlyosság</Label>
          <select id="sev" className="h-8 w-full rounded-lg border bg-card px-2 text-sm" value={severity} onChange={(event) => setSeverity(event.target.value as Severity | "mind")}>
            <option value="mind">Mind</option>
            {Object.entries(SEVERITY_LABEL).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      <label className="block max-w-sm space-y-1 text-sm">
        <span className="text-muted-foreground">Cég</span>
        <select className="h-8 w-full rounded-lg border bg-card px-2" value={companyId} onChange={(event) => setCompanyId(event.target.value)} aria-label="Cég szűrő">
          <option value="mind">Mind a tíz</option>
          {audited.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
      </label>
      <p className="text-sm text-muted-foreground">{rows.length} megállapítás</p>
      <div className="space-y-3">
        {rows.map((item) => {
          const company = companies.find((entry) => entry.id === item.companyId)
          return (
            <details key={item.id} className="rounded-xl border border-border bg-card p-4">
              <summary className="cursor-pointer font-medium">
                {item.title}
                <span className="ml-2 text-sm font-normal text-muted-foreground">{company?.name}</span>
              </summary>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">{CATEGORY_LABEL[item.category]}</Badge>
                <Badge variant="outline">{SEVERITY_LABEL[item.severity]}</Badge>
                <Badge variant="outline">{CERTAINTY_LABEL[item.certainty]}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6">{item.observation}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Bizonyíték: {item.evidence}</p>
              <p className="mt-2 text-sm leading-6">Javaslat: {item.recommendation}</p>
              <Link href={`/audits/${item.companyId}`} className="mt-3 inline-block text-sm hover:underline">
                A cég auditja
              </Link>
            </details>
          )
        })}
      </div>
    </div>
  )
}
