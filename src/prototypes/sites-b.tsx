"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Banner, Field, TextArea, TextInput, useLeadForm } from "./ui"

function Menu({ open, links, close }: { open: boolean; links: { href: string; label: string }[]; close: () => void }) {
  if (!open) return null
  return (
    <div className="flex flex-col gap-2 border-t px-4 py-3 md:hidden">
      {links.map((link) => (
        <Link key={link.href} href={link.href} onClick={close}>{link.label}</Link>
      ))}
    </div>
  )
}

const cars = [
  { id: "1", site: "Óbuda", body: "SUV", name: "Minta SUV" },
  { id: "2", site: "Óbuda", body: "Kombi", name: "Minta kombi" },
  { id: "3", site: "Pest", body: "Sedan", name: "Minta sedan" },
  { id: "4", site: "Pest", body: "SUV", name: "Minta városi SUV" },
]

export function Becsi({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const [site, setSite] = useState("mind")
  const [body, setBody] = useState("mind")
  const form = useLeadForm()
  const links = [
    ["/p/becsi", "Kezdés"],
    ["/p/becsi/keszlet", "Készlet"],
    ["/p/becsi/finanszirozas", "Finanszírozás"],
    ["/p/becsi/atvetel", "Átvétel"],
    ["/p/becsi/kapcsolat", "Kapcsolat"],
  ].map(([href, label]) => ({ href, label }))
  const shown = cars.filter((car) => (site === "mind" || car.site === site) && (body === "mind" || car.body === body))
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#221c18]">
      <Banner name="Bécsi Autópark" />
      <header className="flex items-center justify-between bg-[#221c18] px-5 py-4 text-[#f7f4ef]">
        <Link href="/p/becsi" className="font-display text-2xl">Bécsi Autópark</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Menü</button>
        <nav className="hidden gap-4 text-sm md:flex" aria-label="Bécsi Autópark koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="px-5 py-8">
        {page === "home" && (
          <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <div>
              <h1 className="font-display text-5xl">Két telep, egy készlet.</h1>
              <p className="mt-4 leading-8">Óbuda, Bécsi út 240. és Pest, Szerencs utca 167. A kampány nem takarja el az autókat.</p>
              <Link href="/p/becsi/keszlet" className="mt-5 inline-block bg-[#c83c2f] px-4 py-2 text-white">Készlet nézése</Link>
            </div>
            <p className="text-sm leading-6">A lenti autók minták. Nem a 2026. októberi élő hirdetések, és nincs rajtuk ár.</p>
          </section>
        )}
        {(page === "home" || page === "keszlet") && (
          <section className="mt-8">
            {page === "keszlet" && <h1 className="font-display text-4xl">Minta készlet</h1>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Filter label="Telep" value={site} set={setSite} options={["mind", "Óbuda", "Pest"]} />
              <Filter label="Karosszéria" value={body} set={setBody} options={["mind", "SUV", "Kombi", "Sedan"]} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {shown.map((car) => (
                <article key={car.id} className="rounded-xl bg-white p-4">
                  <h2 className="text-xl">{car.name}</h2>
                  <p className="text-sm">{car.body} · {car.site} · nem élő hirdetés</p>
                  <Link href="/p/becsi/kapcsolat" className="mt-2 inline-block text-sm underline">Érdeklődöm</Link>
                </article>
              ))}
              {shown.length === 0 && <p>Nincs ilyen minta. Változtasson a szűrőn.</p>}
            </div>
          </section>
        )}
        {page === "finanszirozas" && (
          <section className="max-w-2xl">
            <h1 className="font-display text-4xl">Finanszírozás</h1>
            <p className="mt-4 leading-8">A kereskedés nyilvános akciót hirdet. Ezt a koncepció nem ismétli kamatként vagy THM-ként. A rész a telepen, a finanszírozó szabálya szerint dől el.</p>
          </section>
        )}
        {page === "atvetel" && (
          <section className="max-w-2xl">
            <h1 className="font-display text-4xl">Átvétel</h1>
            <p className="mt-4 leading-8">A saját szöveg szerint van állapotfelmérés, eredetiségvizsgálat és expressz átírás. A koncepció ezeket egy listára teszi, szerződést nem köt.</p>
          </section>
        )}
        {page === "kapcsolat" && (
          <form className="max-w-lg space-y-3" onSubmit={(event) => form.submit(event, "Az érdeklődés")} noValidate>
            <h1 className="font-display text-4xl">Kapcsolat</h1>
            <p className="text-sm">+36 1 300 3333 · info@becsiautopark.hu</p>
            <Field id="be-name" label="Név" error={form.errors.name}><TextInput id="be-name" name="name" error={form.errors.name} /></Field>
            <Field id="be-email" label="E-mail" error={form.errors.email}><TextInput id="be-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="be-message" label="Melyik telep, milyen autó" error={form.errors.message}><TextArea id="be-message" error={form.errors.message} /></Field>
            <button type="submit" className="bg-[#c83c2f] px-4 py-2 text-white">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "keszlet", "finanszirozas", "atvetel", "kapcsolat"].includes(page) && <Missing href="/p/becsi" />}
      </main>
    </div>
  )
}

export function Himes({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState("mind")
  const form = useLeadForm()
  const links = [
    ["/p/himesudvar", "Birtok"],
    ["/p/himesudvar/borok", "Borok"],
    ["/p/himesudvar/kostolo", "Kóstoló"],
    ["/p/himesudvar/birtok", "Pince"],
    ["/p/himesudvar/latogatas", "Látogatás"],
  ].map(([href, label]) => ({ href, label }))
  const wines = [
    { name: "Sárgamuskotály félszáraz", style: "feher", note: "A főoldal 2025-ös tételt említ. Árat nem írunk." },
    { name: "Száraz újdonságok", style: "szaraz", note: "A menü „új száraz borokat” ígér. A tétellista a pincészeté." },
    { name: "Aszúválogatás", style: "aszu", note: "Díszdoboz a jelenlegi oldalon. Itt a bor van elöl." },
  ]
  const shown = wines.filter((wine) => style === "mind" || wine.style === style)
  return (
    <div className="min-h-screen bg-[#f6efe6] text-[#4a1428]">
      <Banner name="Hímesudvar" />
      <header className="flex items-center justify-between px-5 py-5">
        <Link href="/p/himesudvar" className="font-display text-3xl">Hímesudvar</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Menü</button>
        <nav className="hidden gap-5 text-sm md:flex" aria-label="Hímesudvar koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="mx-auto max-w-3xl px-5 pb-16">
        {page === "home" && (
          <section className="text-center">
            <p className="text-sm uppercase tracking-[0.18em]">Tokaj</p>
            <h1 className="font-display mt-3 text-5xl">Előbb a pince, aztán az üveg.</h1>
            <p className="mt-4 leading-8">A Tokaj Kalauz és a Lonely Planet mondata a pincészet saját oldalán szerepel. A koncepció a kóstolót teszi az első cselekvésnek.</p>
            <Link href="/p/himesudvar/latogatas" className="mt-6 inline-block border-b border-[#4a1428] pb-1">Kóstolót kérek</Link>
          </section>
        )}
        {page === "borok" && (
          <section>
            <h1 className="font-display text-4xl">Borok</h1>
            <div className="mt-4 flex gap-2">
              {[
                ["mind", "Mind"],
                ["feher", "Félszáraz"],
                ["szaraz", "Száraz"],
                ["aszu", "Aszú"],
              ].map(([value, label]) => (
                <button key={value} type="button" aria-pressed={style === value} className="border-b px-2 py-1 text-sm" onClick={() => setStyle(value)}>{label}</button>
              ))}
            </div>
            <ul className="mt-4 space-y-4">
              {shown.map((wine) => (
                <li key={wine.name}>
                  <h2 className="font-display text-2xl">{wine.name}</h2>
                  <p className="text-sm leading-6">{wine.note}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        {page === "kostolo" && (
          <section>
            <h1 className="font-display text-4xl">Kóstoló</h1>
            <p className="mt-4 leading-8">A jelenlegi oldal külön álistát tart. Az árat nem másoljuk ide. A látogatás kérése a következő oldalon van.</p>
          </section>
        )}
        {page === "birtok" && (
          <section>
            <h1 className="font-display text-4xl">A birtok</h1>
            <p className="mt-4 leading-8">Tokaji ház, nyitott ajtóval a saját történet szerint. A pontos címet a pincészet kapcsolatoldala adja, ide nem írtunk kitalált házszámot.</p>
          </section>
        )}
        {page === "latogatas" && (
          <form className="space-y-3" onSubmit={(event) => form.submit(event, "A látogatás")} noValidate>
            <h1 className="font-display text-4xl">Látogatás</h1>
            <Field id="h-name" label="Név" error={form.errors.name}><TextInput id="h-name" name="name" error={form.errors.name} /></Field>
            <Field id="h-email" label="E-mail" error={form.errors.email}><TextInput id="h-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="h-message" label="Hányan, melyik nap" error={form.errors.message}><TextArea id="h-message" error={form.errors.message} /></Field>
            <button type="submit" className="bg-[#4a1428] px-4 py-2 text-[#f6efe6]">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "borok", "kostolo", "birtok", "latogatas"].includes(page) && <Missing href="/p/himesudvar" />}
      </main>
    </div>
  )
}

const homes = [
  { name: "Metrodom River", district: "XI.", rooms: "4", note: "A főoldal linkjei között a River szerepel." },
  { name: "IX. kerületi zöld udvar", district: "IX.", rooms: "1", note: "516 lakásos leírás a főoldalon. A hivatalos háznevet a céggel egyeztetjük." },
  { name: "XIII. kerületi vízparti ház", district: "XIII.", rooms: "3", note: "434 lakásos leírás a főoldalon. A hivatalos név nélkül." },
]

export function Metrodom({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const [district, setDistrict] = useState("mind")
  const [rooms, setRooms] = useState("mind")
  const form = useLeadForm()
  const links = [
    ["/p/metrodom", "Házak"],
    ["/p/metrodom/parkok", "Lakóparkok"],
    ["/p/metrodom/haz", "River"],
    ["/p/metrodom/miert", "Miért"],
    ["/p/metrodom/erdeklodes", "Érdeklődés"],
  ].map(([href, label]) => ({ href, label }))
  const shown = useMemo(
    () => homes.filter((home) => (district === "mind" || home.district === district) && (rooms === "mind" || home.rooms === rooms)),
    [district, rooms],
  )
  return (
    <div className="min-h-screen bg-[#f3efe8] text-[#161616]">
      <Banner name="Metrodom" />
      <header className="flex items-center justify-between px-5 py-4">
        <Link href="/p/metrodom" className="text-sm tracking-[0.2em] uppercase">Metrodom</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Menü</button>
        <nav className="hidden gap-4 text-sm md:flex" aria-label="Metrodom koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="px-5 pb-16">
        {page === "home" && (
          <section>
            <h1 className="font-display text-6xl leading-none">Előbb a ház.</h1>
            <p className="mt-4 max-w-xl leading-8">A lakáskód a részleten marad. Árat a koncepció nem ír, mert az élő ajánlat a keresőben változik.</p>
          </section>
        )}
        {(page === "home" || page === "parkok") && (
          <section className="mt-8">
            {page === "parkok" && <h1 className="font-display text-4xl">Lakóparkok</h1>}
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Filter label="Kerület" value={district} set={setDistrict} options={["mind", "IX.", "XI.", "XIII."]} />
              <Filter label="Szobák a mintában" value={rooms} set={setRooms} options={["mind", "1", "3", "4"]} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {shown.map((home) => (
                <article key={home.name} className="bg-white p-4">
                  <p className="text-4xl">{home.district}</p>
                  <h2 className="mt-2 text-xl">{home.name}</h2>
                  <p className="mt-2 text-sm leading-6">{home.note}</p>
                </article>
              ))}
              {shown.length === 0 && <p>Nincs ilyen minta.</p>}
            </div>
          </section>
        )}
        {page === "haz" && (
          <section className="max-w-2xl">
            <h1 className="font-display text-4xl">Metrodom River</h1>
            <p className="mt-4 leading-8">A főoldal híre a River új épületének kapunyitásáról szól. A lakáslistát nem másoltuk, mert az ár élő adat.</p>
            <Link href="/p/metrodom/erdeklodes" className="mt-4 inline-block underline">Érdekel a ház</Link>
          </section>
        )}
        {page === "miert" && (
          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["Gondoskodás", "A care ígéret magyarul: átlátható átadás."],
              ["Folytonosság", "A continuity: a ház a beköltözés után is a fejlesztőé marad a saját szöveg szerint."],
              ["Közösség", "A community: közös terek, nem csak lakáskódok."],
            ].map(([title, text]) => (
              <article key={title} className="bg-white p-4">
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-6">{text}</p>
              </article>
            ))}
          </section>
        )}
        {page === "erdeklodes" && (
          <form className="max-w-lg space-y-3" onSubmit={(event) => form.submit(event, "Az érdeklődés")} noValidate>
            <h1 className="font-display text-4xl">Érdeklődés</h1>
            <Field id="m-name" label="Név" error={form.errors.name}><TextInput id="m-name" name="name" error={form.errors.name} /></Field>
            <Field id="m-email" label="E-mail" error={form.errors.email}><TextInput id="m-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="m-message" label="Kerület és szobaszám" error={form.errors.message}><TextArea id="m-message" error={form.errors.message} /></Field>
            <button type="submit" className="bg-black px-4 py-2 text-white">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "parkok", "haz", "miert", "erdeklodes"].includes(page) && <Missing href="/p/metrodom" />}
      </main>
    </div>
  )
}

export function TransSped({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const form = useLeadForm()
  const links = [
    ["/p/transsped", "Feladat"],
    ["/p/transsped/szolgaltatasok", "Szolgáltatások"],
    ["/p/transsped/halozat", "Hálózat"],
    ["/p/transsped/feladat", "Raktár"],
    ["/p/transsped/ajanlat", "Ajánlat"],
  ].map(([href, label]) => ({ href, label }))
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#0c2340]">
      <Banner name="Trans-Sped" />
      <header className="flex items-center justify-between bg-[#0c2340] px-5 py-4 text-white">
        <Link href="/p/transsped" className="font-display text-2xl">Trans-Sped</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Menü</button>
        <nav className="hidden gap-4 text-sm md:flex" aria-label="Trans-Sped koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="px-5 py-8">
        {page === "home" && (
          <section>
            <p className="bg-[#ff6a2a] px-3 py-2 text-sm text-white">A tanúsítvány 2026. december 1-jén lejár, és a lánc hiányos. Ezt a redesigntől függetlenül kell javítani.</p>
            <h1 className="font-display mt-6 text-5xl">Milyen árut viszünk?</h1>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {["Közút", "Raktár", "Vám", "E-kereskedelem"].map((item) => (
                <Link key={item} href="/p/transsped/szolgaltatasok" className="bg-white p-4 text-xl">{item}</Link>
              ))}
            </div>
          </section>
        )}
        {page === "szolgaltatasok" && (
          <section>
            <h1 className="font-display text-4xl">Szolgáltatások</h1>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {["Közúti szállítmányozás", "Raktárlogisztika", "Termelési logisztika", "Légi, tengeri és vasúti", "Vámügyintézés", "Ipari park", "Technológia és karbantartás", "E-kereskedelmi logisztika"].map((item) => (
                <li key={item} className="border border-[#0c2340]/15 bg-white px-4 py-3">{item}</li>
              ))}
            </ul>
          </section>
        )}
        {page === "halozat" && (
          <section>
            <h1 className="font-display text-4xl">Hálózat</h1>
            <p className="mt-4 max-w-2xl leading-8">A főoldal Debrecent, Budapestet, Tatát, Tatabányát, Kecskemétet és további telepeket sorol. A székhely a lábléc szerint Debrecen, Vámraktár utca 3.</p>
          </section>
        )}
        {page === "feladat" && (
          <section className="max-w-2xl">
            <h1 className="font-display text-4xl">Raktár, nem körkép</h1>
            <p className="mt-4 leading-8">A piaci esszé a hírekben marad. Ezen az oldalon egy feladat van: hol tartjuk az árut, és hogyan megy tovább.</p>
          </section>
        )}
        {page === "ajanlat" && (
          <form className="max-w-lg space-y-3" onSubmit={(event) => form.submit(event, "Az ajánlatkérés")} noValidate>
            <h1 className="font-display text-4xl">Ajánlat</h1>
            <Field id="t-name" label="Név" error={form.errors.name}><TextInput id="t-name" name="name" error={form.errors.name} /></Field>
            <Field id="t-email" label="E-mail" error={form.errors.email}><TextInput id="t-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="t-message" label="Reláció, irány, rendszeresség" error={form.errors.message}><TextArea id="t-message" error={form.errors.message} /></Field>
            <button type="submit" className="bg-[#ff6a2a] px-4 py-2 text-white">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "szolgaltatasok", "halozat", "feladat", "ajanlat"].includes(page) && <Missing href="/p/transsped" />}
      </main>
    </div>
  )
}

export function Gundel({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const [seat, setSeat] = useState("vacsora")
  const form = useLeadForm()
  const links = [
    ["/p/gundel", "Ma"],
    ["/p/gundel/etterem", "Étlap"],
    ["/p/gundel/rendezveny", "Rendezvény"],
    ["/p/gundel/tortenet", "130 év"],
    ["/p/gundel/asztal", "Asztal"],
  ].map(([href, label]) => ({ href, label }))
  return (
    <div className="min-h-screen bg-[#f4f0e6] text-[#143028]">
      <Banner name="Gundel" />
      <header className="border-b border-[#c6a15b] px-5 py-5 text-center">
        <div className="flex items-center justify-between">
          <Link href="/p/gundel" className="font-display text-3xl">Gundel</Link>
          <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Menü</button>
          <nav className="hidden gap-5 text-sm md:flex" aria-label="Gundel koncepció">
            {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>
        </div>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="mx-auto max-w-3xl px-5 py-10">
        {page === "home" && (
          <section className="text-center">
            <h1 className="font-display text-5xl">Ma este asztal, nem bál.</h1>
            <div className="mt-6 grid gap-3 text-left md:grid-cols-3">
              {[
                ["asztal", "Asztal", "Vacsora 18:00–22:00, a ház saját időbeosztása."],
                ["etlap", "Étlap", "Nappali, vacsora, borlap és vasárnapi menü külön."],
                ["rendezveny", "Rendezvény", "Szilveszter, bál, tündérliget: nem a mai fogás."],
              ].map(([id, title, text]) => (
                <Link key={id} href={id === "asztal" ? "/p/gundel/asztal" : id === "etlap" ? "/p/gundel/etterem" : "/p/gundel/rendezveny"} className="border border-[#c6a15b] bg-white p-4">
                  <h2 className="font-display text-2xl">{title}</h2>
                  <p className="mt-2 text-sm leading-6">{text}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
        {page === "etterem" && (
          <section>
            <h1 className="font-display text-4xl">Étlapidőszakok</h1>
            <ul className="mt-4 space-y-3">
              {["Nappali étlap 11:30–18:00", "Vacsora 18:00–22:00", "Vasárnapi ebéd 11:30–16:00", "Gyermek menü"].map((item) => (
                <li key={item} className="border-b border-[#c6a15b] py-2">{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm">Fogásárat nem találtunk ki. A Nemzeti 11 a ház saját válogatása.</p>
          </section>
        )}
        {page === "rendezveny" && (
          <section>
            <h1 className="font-display text-4xl">Rendezvény</h1>
            <p className="mt-4 leading-8">Szilveszter 2026, Gundel Bál 2027 és a Tündérliget a nyilvános menüben szerepel. Jegyet ez a koncepció nem ad el.</p>
          </section>
        )}
        {page === "tortenet" && (
          <section>
            <h1 className="font-display text-4xl">130 év</h1>
            <p className="mt-4 leading-8">A történet itt lakik, nem a vacsora fölött. A séfek és a kert a ház saját oldalán maradnak a forrásnak.</p>
          </section>
        )}
        {page === "asztal" && (
          <form className="space-y-3" onSubmit={(event) => form.submit(event, "Az asztalkérés")} noValidate>
            <h1 className="font-display text-4xl">Asztal</h1>
            <div className="flex gap-2">
              {["ebéd", "vacsora"].map((item) => (
                <button key={item} type="button" aria-pressed={seat === item} className="border border-[#143028] px-3 py-1 text-sm" onClick={() => setSeat(item)}>{item}</button>
              ))}
            </div>
            <Field id="g-name" label="Név" error={form.errors.name}><TextInput id="g-name" name="name" error={form.errors.name} /></Field>
            <Field id="g-email" label="E-mail" error={form.errors.email}><TextInput id="g-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="g-message" label={`${seat} — hányan, melyik nap`} error={form.errors.message}><TextArea id="g-message" error={form.errors.message} /></Field>
            <button type="submit" className="bg-[#143028] px-4 py-2 text-[#f4f0e6]">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "etterem", "rendezveny", "tortenet", "asztal"].includes(page) && <Missing href="/p/gundel" />}
      </main>
    </div>
  )
}

function Filter({ label, value, set, options }: { label: string; value: string; set: (value: string) => void; options: string[] }) {
  return (
    <label className="text-sm">
      {label}
      <select className="ml-2 border bg-white px-2 py-1 text-[#221c18]" value={value} onChange={(event) => set(event.target.value)} aria-label={label}>
        {options.map((option) => (
          <option key={option} value={option}>{option === "mind" ? "Mind" : option}</option>
        ))}
      </select>
    </label>
  )
}

function Missing({ href }: { href: string }) {
  return <p>Nincs ilyen oldal. <Link className="underline" href={href}>Vissza</Link></p>
}
