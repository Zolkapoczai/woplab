"use client"

import Link from "next/link"
import { useLab } from "@/components/lab/provider"
import { rankCompanies } from "@/lib/scoring"

const concept: Record<string, { idea: string; fixes: string; tone: string }> = {
  katalin: {
    idea: "A Balaton és a wellness előre kerül, a szezonális csomag a második sáv.",
    fixes: "Tömött title, akcióhalmaz, szétszórt .html utak.",
    tone: "bg-[#e7f3ef] text-[#12352f]",
  },
  boengineering: {
    idea: "Egy mérnöki felület, ahol a feladat és három referencia vezeti az ajánlatot.",
    fixes: "Hiányzó h1, üres képszövegek, lista helyett történet.",
    tone: "bg-[#1b1e22] text-[#f4efe4]",
  },
  becsi: {
    idea: "Két telephely készlete és egy szűrő a kampányok helyett.",
    fixes: "Hiányzó h1, üres alt szövegek, ismétlődő akciók.",
    tone: "bg-[#f6f1ea] text-[#241c18]",
  },
  arsmedica: {
    idea: "Három betegút: vizsgálat, műtét, ár. Orvosi ígéret nélkül.",
    fixes: "Mély menü, üres alt, hiányzó főoldali űrlap.",
    tone: "bg-[#f8f1ee] text-[#3d2428]",
  },
  sanatmetal: {
    idea: "Egy címsor, utána a termékkörök külön közönséggel.",
    fixes: "Tíz h1, jelöletlen munkamenet-süti, robots.txt hiánya.",
    tone: "bg-[#eef2f4] text-[#172027]",
  },
  himesudvar: {
    idea: "A birtok és a kóstoló egy csendes oldalon, a shop a második út.",
    fixes: "Angol nyelvi jelölés, hiányzó h1, felkiáltójeles menü.",
    tone: "bg-[#f6efe6] text-[#4a1428]",
  },
  metrodom: {
    idea: "Először a ház és a kerület, a lakáskód csak a részleten.",
    fixes: "„kezdőoldal” title, robots.txt 404, kód az első linken.",
    tone: "bg-[#efeae3] text-[#1a1a1a]",
  },
  kolping: {
    idea: "Korosztály választása, aztán a foglalás. A meglévő figura nélkül.",
    fixes: "Jelöletlen PHP munkamenet, a program és az ár külön felületen.",
    tone: "bg-[#f4efe2] text-[#234237]",
  },
  transsped: {
    idea: "A szolgáltatás nyit, a piaci körkép a hírekbe kerül. A TLS külön, sürgős tétel.",
    fixes: "Hiányos tanúsítványlánc, tiltott bemutatkozó, hírszerű főoldal.",
    tone: "bg-[#e8eef6] text-[#0c2340]",
  },
  gundel: {
    idea: "Asztal, étlap, rendezvény. A 130 év külön oldalon.",
    fixes: "Hiányzó h1, üres alt, egyenrangú események.",
    tone: "bg-[#f3efe4] text-[#143028]",
  },
}

export default function RedesignsPage() {
  const { companies, settings } = useLab()
  const selected = rankCompanies(companies.filter((item) => item.selected), settings)
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Redesign galéria</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Tíz külön felület. Mindegyik koncepció, egyik sem a cég éles oldala. A kártya a prototípust nyitja, nem egy képet.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {selected.map((company) => {
          const card = concept[company.id]
          return (
            <article key={company.id} className={`rounded-2xl p-5 ${card.tone}`}>
              <p className="text-xs uppercase tracking-[0.14em] opacity-70">{company.city}</p>
              <h2 className="font-display mt-2 text-3xl">{company.name}</h2>
              <p className="mt-3 leading-7">{card.idea}</p>
              <p className="mt-2 text-sm opacity-80">Amit rendez: {card.fixes}</p>
              <Link href={`/p/${company.id}`} className="mt-4 inline-flex rounded-full bg-current/10 px-4 py-2 text-sm underline-offset-4 hover:underline">
                Prototípus megnyitása
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
