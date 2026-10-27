"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useLab, usePriced } from "@/components/lab/provider"
import { huf } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProposalPage() {
  const params = useParams<{ slug: string }>()
  const { companies, updateProposal } = useLab()
  const company = companies.find((item) => item.id === params.slug)
  const data = usePriced(params.slug)
  if (!company || !data) return <p>Ehhez a céghez nincs szerkeszthető ajánlat.</p>
  const { seed, priced } = data

  return (
    <article className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            <Link href="/proposals" className="hover:underline">Ajánlatok</Link> / {company.name}
          </p>
          <h1 className="font-display mt-2 text-4xl">Kivitelezési ajánlat</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6">{seed.goal}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/present/${company.id}`}>Ügyfél nézet</Link>
        </Button>
      </header>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Nettó díj" value={huf(priced.oneTimeNet)} />
        <Stat label="Áfa" value={huf(priced.vat)} />
        <Stat label="Bruttó becslés" value={huf(priced.oneTimeGross)} />
        <Stat label="Belső költség" value={huf(priced.internalDelivery + priced.internalPrep)} />
      </section>
      <section>
        <h2 className="font-display text-2xl">Tételek</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Ajánlati tételek</caption>
            <thead className="text-xs text-muted-foreground uppercase">
              <tr>
                {["Benne", "Tétel", "Óra", "Díj", "Nettó"].map((head) => (
                  <th key={head} scope="col" className="px-2 py-2 font-medium">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {priced.lines.map((line) => (
                <tr key={line.id} className="border-t border-border align-top">
                  <td className="px-2 py-3">
                    <Checkbox
                      checked={line.included}
                      onCheckedChange={(checked) =>
                        updateProposal(company.id, { lines: { [line.id]: { included: checked === true } } })
                      }
                      aria-label={`${line.label} benne van`}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <p className="font-medium">{line.label}</p>
                    <p className="text-muted-foreground">{line.detail}</p>
                    <p className="text-xs uppercase text-muted-foreground">{bucket(line.bucket)}</p>
                  </td>
                  <td className="px-2 py-3">
                    <Label className="sr-only" htmlFor={`${line.id}-h`}>Óra</Label>
                    <Input
                      id={`${line.id}-h`}
                      className="w-20"
                      type="number"
                      min={0}
                      value={line.hours}
                      onChange={(event) =>
                        updateProposal(company.id, { lines: { [line.id]: { hours: Number(event.target.value) } } })
                      }
                    />
                  </td>
                  <td className="px-2 py-3">
                    <Label className="sr-only" htmlFor={`${line.id}-r`}>Óradíj</Label>
                    <Input
                      id={`${line.id}-r`}
                      className="w-28"
                      type="number"
                      min={0}
                      step={1000}
                      value={line.rate}
                      onChange={(event) =>
                        updateProposal(company.id, { lines: { [line.id]: { rate: Number(event.target.value) } } })
                      }
                    />
                  </td>
                  <td className="px-2 py-3">{huf(line.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border p-4">
          <h2 className="font-display text-2xl">Kedvezmény és üzemeltetés</h2>
          <div className="space-y-1">
            <Label htmlFor="discount">Kedvezmény a kivitelezésen, %</Label>
            <Input
              id="discount"
              type="number"
              min={0}
              max={40}
              value={priced.discountPct}
              onChange={(event) => updateProposal(company.id, { discountPct: Number(event.target.value) })}
            />
          </div>
          <p className="text-sm">Kedvezmény értéke: {huf(priced.discountValue)}. Külső tételek: {huf(priced.externalNet)}. Licencek: {huf(priced.licenseNet)}.</p>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={priced.maintenanceEnabled}
              onCheckedChange={(checked) => updateProposal(company.id, { maintenanceEnabled: checked === true })}
            />
            Opcionális havi üzemeltetés megjelenítése
          </label>
          <div className="space-y-1">
            <Label htmlFor="care">Havi díj, Ft</Label>
            <Input
              id="care"
              type="number"
              min={0}
              step={10000}
              value={priced.maintenanceMonthly}
              onChange={(event) => updateProposal(company.id, { maintenanceMonthly: Number(event.target.value) })}
            />
          </div>
          <p className="text-sm text-muted-foreground">{seed.maintenanceNote}</p>
          {priced.maintenanceEnabled && <p className="text-sm">Éves üzemeltetés, ha kérik: {huf(priced.maintenanceYear)}.</p>}
          <p className="text-sm">Belső előkészítés, nem számlázott prototípus: {huf(priced.internalPrep)}.</p>
        </div>
        <div className="space-y-4 text-sm leading-6">
          <List title="Oldalak" items={seed.pages} />
          <List title="Mérföldkövek" items={seed.milestones.map((item) => `${item.name} (${item.weeks}. hét): ${item.detail}`)} />
          <List title="Az ügyfél adja" items={seed.clientMaterials} />
          <List title="Kizárások" items={seed.exclusions} />
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2 text-sm leading-6">
        <div>
          <h2 className="font-display text-2xl">Szállítás</h2>
          <p className="mt-2">CMS: {seed.cms}</p>
          <p>Integráció: {seed.integrations.join(" ")}</p>
          <p>Migráció: {seed.migration}</p>
          <p>Teszt: {seed.testing}</p>
        </div>
        <div>
          <h2 className="font-display text-2xl">Hipotézisek</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {seed.hypotheses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
            {seed.assumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-2xl">{value}</p>
    </div>
  )
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function bucket(value: string) {
  if (value === "external") return "Külső költség"
  if (value === "license") return "Licenc"
  return "Kivitelezés"
}
