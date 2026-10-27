"use client"

import { useLab } from "@/components/lab/provider"
import { SCORE_LABEL, huf } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RateKey, ScoreKey } from "@/lib/types"

const scoreKeys: Array<ScoreKey | "traffic"> = ["businessValue", "opportunities", "websiteRole", "traffic", "feasibility", "salesAccess"]
const rateKeys: RateKey[] = ["design", "dev", "content", "pm", "qa"]
const rateLabel: Record<RateKey, string> = {
  design: "Design",
  dev: "Fejlesztés",
  content: "Tartalom",
  pm: "Irányítás",
  qa: "Teszt",
}

export default function SettingsPage() {
  const { settings, updateSettings, resetAll } = useLab()
  const weightSum = scoreKeys.reduce((sum, key) => sum + settings.weights[key], 0)
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">Módszertan és ár</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Adatfrissítés: {settings.dataUpdatedAt}. A súlyok és a díjak itt állnak, nem szétszórva a képernyőkben. A módosítás a böngészőben marad.
        </p>
      </header>
      <section>
        <h2 className="font-display text-2xl">Rangsorolási súlyok</h2>
        <p className="mt-1 text-sm text-muted-foreground">Összeg most: {weightSum}. A forgalom súlya csak akkor számít, ha van bizonyíték. Jelenleg egyik cégnél sincs.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scoreKeys.map((key) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`w-${key}`}>{SCORE_LABEL[key]}</Label>
              <Input
                id={`w-${key}`}
                type="number"
                min={0}
                value={settings.weights[key]}
                onChange={(event) => updateSettings({ weights: { ...settings.weights, [key]: Number(event.target.value) } })}
              />
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <RateBlock title="Értékesítési óradíj" values={settings.sellRates} onChange={(sellRates) => updateSettings({ sellRates })} />
        <RateBlock title="Belső óradíj" values={settings.internalRates} onChange={(internalRates) => updateSettings({ internalRates })} />
      </section>
      <section className="max-w-xs space-y-1">
        <Label htmlFor="vat">Áfa kulcs</Label>
        <Input
          id="vat"
          type="number"
          min={0}
          max={0.5}
          step={0.01}
          value={settings.vatRate}
          onChange={(event) => updateSettings({ vatRate: Number(event.target.value) })}
        />
        <p className="text-xs text-muted-foreground">Most {Math.round(settings.vatRate * 100)}%. Példa 1 000 000 Ft nettóra: {huf(Math.round(1_000_000 * settings.vatRate))} áfa.</p>
      </section>
      <section className="grid gap-6 lg:grid-cols-2 text-sm leading-6">
        <List title="Árfeltételezések" items={settings.pricingNotes} />
        <List title="Biztonsági szabályok" items={settings.securityRules} />
        <List title="Auditkritériumok" items={settings.auditCriteria} />
        <List title="Kutatási források" items={settings.researchSources} />
      </section>
      <Button type="button" variant="outline" onClick={resetAll}>
        Helyi módosítások törlése
      </Button>
    </div>
  )
}

function RateBlock({
  title,
  values,
  onChange,
}: {
  title: string
  values: Record<RateKey, number>
  onChange: (values: Record<RateKey, number>) => void
}) {
  return (
    <div>
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 space-y-2">
        {rateKeys.map((key) => (
          <div key={key} className="grid grid-cols-[1fr_140px] items-center gap-2">
            <Label htmlFor={`${title}-${key}`}>{rateLabel[key]}</Label>
            <Input
              id={`${title}-${key}`}
              type="number"
              min={0}
              step={1000}
              value={values[key]}
              onChange={(event) => onChange({ ...values, [key]: Number(event.target.value) })}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="font-display text-2xl">{title}</h2>
      <ul className="mt-2 list-disc space-y-2 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
