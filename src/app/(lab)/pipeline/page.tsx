"use client"

import Link from "next/link"
import { useLab } from "@/components/lab/provider"
import { PIPELINE_LABEL } from "@/lib/format"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PipelineStatus } from "@/lib/types"

const statuses = Object.keys(PIPELINE_LABEL) as PipelineStatus[]

export default function PipelinePage() {
  const { companies, updatePipeline } = useLab()
  const rows = [...companies].sort((a, b) => {
    if (a.selected !== b.selected) return a.selected ? -1 : 1
    return (a.salesPriority || 99) - (b.salesPriority || 99)
  })
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Pipeline</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          A státusz, a következő teendő és a jegyzet a böngészőben marad. Az alkalmazás nem küld levelet és nem keresi a cégeket.
        </p>
      </header>
      <div className="space-y-4">
        {rows.map((company) => (
          <article key={company.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl">
                <Link href={`/companies/${company.id}`} className="hover:underline">{company.name}</Link>
              </h2>
              <p className="text-xs text-muted-foreground">{company.selected ? `Sales prioritás ${company.salesPriority}` : "Hosszú lista"}</p>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-[180px_1fr_1fr]">
              <div className="space-y-1">
                <Label htmlFor={`${company.id}-status`}>Státusz</Label>
                <select
                  id={`${company.id}-status`}
                  className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                  value={company.pipelineStatus}
                  onChange={(event) => updatePipeline(company.id, { status: event.target.value as PipelineStatus })}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{PIPELINE_LABEL[status]}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${company.id}-next`}>Következő teendő</Label>
                <Textarea
                  id={`${company.id}-next`}
                  value={company.nextAction}
                  onChange={(event) => updatePipeline(company.id, { nextAction: event.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${company.id}-note`}>Kapcsolati jegyzet</Label>
                <Textarea
                  id={`${company.id}-note`}
                  value={company.pipelineNote}
                  placeholder="Csak belső használatra"
                  onChange={(event) => updatePipeline(company.id, { note: event.target.value })}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
