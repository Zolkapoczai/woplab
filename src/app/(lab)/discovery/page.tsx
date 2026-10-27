"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useLab } from "@/components/lab/provider"
import { scoreCompany } from "@/lib/scoring"
import { AUDIT_LABEL, hufCompact } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { priceProposal } from "@/lib/pricing"
import type { Company } from "@/lib/types"

type SortKey = "score" | "name" | "sector" | "value" | "priority"

export default function DiscoveryPage() {
  const { companies, settings, proposals, proposalPatch } = useLab()
  const [query, setQuery] = useState("")
  const [sector, setSector] = useState("mind")
  const [status, setStatus] = useState("mind")
  const [onlySelected, setOnlySelected] = useState(false)
  const [sort, setSort] = useState<SortKey>("score")
  const sectors = [...new Set(companies.map((item) => item.sector))].sort((a, b) => a.localeCompare(b, "hu"))

  const rows = useMemo(() => {
    const filtered = companies.filter((company) => {
      const blob = `${company.name} ${company.domain} ${company.city} ${company.activity}`.toLowerCase()
      if (query && !blob.includes(query.toLowerCase())) return false
      if (sector !== "mind" && company.sector !== sector) return false
      if (status !== "mind" && company.auditStatus !== status) return false
      if (onlySelected && !company.selected) return false
      return true
    })
    const valueOf = (company: Company) => {
      const seed = proposals.find((item) => item.companyId === company.id)
      if (!seed) return company.projectBand.max
      return priceProposal(seed, settings, proposalPatch(company.id)).oneTimeNet
    }
    filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "hu")
      if (sort === "sector") return a.sector.localeCompare(b.sector, "hu")
      if (sort === "value") return valueOf(b) - valueOf(a)
      if (sort === "priority") return (a.salesPriority || 99) - (b.salesPriority || 99)
      return scoreCompany(b, settings).normalized - scoreCompany(a, settings).normalized
    })
    return filtered.map((company) => ({ company, score: scoreCompany(company, settings), value: valueOf(company) }))
  }, [companies, onlySelected, proposalPatch, proposals, query, sector, settings, sort, status])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Felfedezés</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {companies.length} cég a 2026. október 27-i körből. A pontszám a hiányzó forgalmat kihagyja, nem bünteti.
        </p>
      </header>
      <form className="grid gap-3 md:grid-cols-4" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="q">Keresés</Label>
          <Input id="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cég, város vagy domain" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sector">Szektor</Label>
          <select id="sector" className="h-8 w-full rounded-lg border bg-card px-2 text-sm" value={sector} onChange={(event) => setSector(event.target.value)}>
            <option value="mind">Mind</option>
            {sectors.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="status">Audit</Label>
          <select id="status" className="h-8 w-full rounded-lg border bg-card px-2 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="mind">Mind</option>
            {Object.entries(AUDIT_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-end gap-4 md:col-span-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlySelected} onChange={(event) => setOnlySelected(event.target.checked)} />
            Csak a tíz kiválasztott
          </label>
          <label className="flex items-center gap-2 text-sm">
            Rendezés
            <select className="h-8 rounded-lg border bg-card px-2" value={sort} onChange={(event) => setSort(event.target.value as SortKey)} aria-label="Rendezés">
              <option value="score">Pontszám</option>
              <option value="priority">Sales prioritás</option>
              <option value="value">Projektérték</option>
              <option value="name">Név</option>
              <option value="sector">Szektor</option>
            </select>
          </label>
          <p className="text-sm text-muted-foreground">{rows.length} találat</p>
        </div>
      </form>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[860px] text-left text-sm">
          <caption className="sr-only">Vizsgált vállalatok</caption>
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              {["Cég", "Szektor", "Domain", "Forgalom", "Audit", "Pont", "Érték", "Prioritás"].map((head) => (
                <th key={head} scope="col" className="px-3 py-2 font-medium">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ company, score, value }) => (
              <tr key={company.id} className="border-t border-border align-top">
                <td className="px-3 py-3">
                  <Link href={`/companies/${company.id}`} className="font-medium hover:underline">
                    {company.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">{company.city}</div>
                </td>
                <td className="px-3 py-3">{company.sector}</td>
                <td className="px-3 py-3">
                  <a href={company.url} className="hover:underline" target="_blank" rel="noreferrer">
                    {company.domain}
                  </a>
                </td>
                <td className="px-3 py-3">{company.traffic.status === "unavailable" ? "Nincs adat" : company.traffic.summary}</td>
                <td className="px-3 py-3">
                  <Badge variant="outline">{AUDIT_LABEL[company.auditStatus]}</Badge>
                </td>
                <td className="px-3 py-3 font-medium">{score.normalized.toFixed(1)}</td>
                <td className="px-3 py-3">{value ? hufCompact(value) : "—"}</td>
                <td className="px-3 py-3">{company.salesPriority ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
