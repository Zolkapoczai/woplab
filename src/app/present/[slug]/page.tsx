"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useLab, usePriced } from "@/components/lab/provider"
import { toClientCompany, publicFindings } from "@/lib/client-view"
import { CATEGORY_LABEL, huf } from "@/lib/format"
import { findings } from "@/data/findings"

export default function PresentPage() {
  const params = useParams<{ slug: string }>()
  const { companies } = useLab()
  const company = companies.find((item) => item.id === params.slug)
  const priced = usePriced(params.slug)
  if (!company || !company.selected || !priced) return <p className="p-8">Ehhez a céghez nincs ügyfélprezentáció.</p>
  const client = toClientCompany(company)
  const visible = publicFindings(findings.filter((item) => item.companyId === company.id && item.priority <= 2)).slice(0, 6)

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#1c1914]">
      <header className="border-b border-[#e4dccb] px-6 py-5">
        <p className="text-xs tracking-[0.16em] uppercase text-[#6d6456]">Koncepció-bemutató · nem a hivatalos weboldal</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-4xl">{client.name}</h1>
          <Link href={`/p/${client.id}`} className="rounded-full bg-[#1f4d3a] px-4 py-2 text-sm text-[#f7f3ea]">
            Új oldal megnyitása
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-12 px-6 py-10">
        <section>
          <h2 className="font-display text-3xl">Hol tart a digitális jelenlét</h2>
          <p className="mt-3 max-w-3xl text-lg leading-8">{client.clientSummary}</p>
          <p className="mt-3 text-sm leading-6 text-[#5c564c]">
            {client.activity} A jelenlegi oldal:{" "}
            <a className="underline" href={client.url}>{client.domain}</a>. A fő cél: {client.primaryGoal}.
          </p>
        </section>
        <section>
          <h2 className="font-display text-3xl">Amit a nyilvános oldalon láttunk</h2>
          <div className="mt-4 grid gap-4">
            {visible.map((item) => (
              <article key={item.id} className="rounded-2xl border border-[#e4dccb] bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-[#6d6456]">{CATEGORY_LABEL[item.category]}</p>
                <h3 className="mt-1 text-xl">{item.title}</h3>
                <p className="mt-2 leading-7">{item.observation}</p>
                <p className="mt-2 text-sm leading-6 text-[#5c564c]">Bizonyíték: {item.evidence}</p>
                <p className="mt-2 leading-7">{item.recommendation}</p>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-3xl">A javasolt oldal</h2>
          <p className="mt-3 leading-7">{priced.seed.goal}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {priced.seed.pages.map((page) => (
              <li key={page} className="rounded-xl bg-white px-4 py-3">{page}</li>
            ))}
          </ul>
          <Link href={`/p/${client.id}`} className="mt-4 inline-block text-sm underline">
            A kattintható koncepció megnyitása
          </Link>
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">Terjedelem</h2>
            <p className="mt-3 leading-7">CMS: {priced.seed.cms}</p>
            <p className="leading-7">Migráció: {priced.seed.migration}</p>
            <p className="leading-7">Teszt és élesítés: {priced.seed.testing}</p>
          </div>
          <div>
            <h2 className="font-display text-3xl">Becslés</h2>
            <p className="mt-3 text-3xl">{huf(priced.priced.oneTimeNet)} nettó</p>
            <p className="text-sm text-[#5c564c]">Áfával {huf(priced.priced.oneTimeGross)}, a jelenlegi beállított kulccsal. Ez becslés, nem szerződés.</p>
            <p className="mt-3 leading-7">Opcionális havi üzemeltetés: {huf(priced.priced.maintenanceMonthly)}. {priced.seed.maintenanceNote}</p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-3xl">Ütem</h2>
          <ol className="mt-4 space-y-3">
            {priced.seed.milestones.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong> · {item.weeks}. hét — {item.detail}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="font-display text-3xl">Következő lépés</h2>
          <p className="mt-3 leading-7">Egy közös egyeztetésen rögzítjük az oldalakat, a csatlakozásokat és a szövegek forrását. Utána a becslésből ajánlat lesz.</p>
          <p className="mt-3 text-sm leading-6 text-[#5c564c]">
            Amit kérünk: {priced.seed.clientMaterials.join(", ")}.
          </p>
          {client.contact.email && <p className="mt-2 text-sm">Nyilvános kapcsolat a cég oldalán: {client.contact.email}</p>}
        </section>
      </main>
      <footer className="border-t border-[#e4dccb] px-6 py-6 text-xs text-[#6d6456]">
        Website Opportunity Lab koncepció, 2026. október 27. Nem a {client.name} hivatalos oldala.
      </footer>
    </div>
  )
}
