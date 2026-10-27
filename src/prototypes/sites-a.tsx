"use client"

import { useState } from "react"
import Link from "next/link"
import { Banner, Field, TextArea, TextInput, useLeadForm } from "./ui"

function Menu({
  open,
  links,
  close,
}: {
  open: boolean
  links: { href: string; label: string }[]
  close: () => void
}) {
  if (!open) return null
  return (
    <div className="flex flex-col gap-2 border-t px-4 py-3 md:hidden">
      {links.map((link) => (
        <Link key={link.href} href={link.href} onClick={close} className="py-1">
          {link.label}
        </Link>
      ))}
    </div>
  )
}

export function Katalin({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const form = useLeadForm()
  const links = [
    ["/p/katalin", "Ház"],
    ["/p/katalin/szobak", "Szobák"],
    ["/p/katalin/wellness", "Wellness"],
    ["/p/katalin/ajanlatok", "Időszak"],
    ["/p/katalin/foglalas", "Foglalás"],
  ].map(([href, label]) => ({ href, label }))
  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#16332f]">
      <Banner name="Wellness Hotel Katalin" />
      <header className="flex items-center justify-between px-5 py-4">
        <Link href="/p/katalin" className="font-display text-2xl">Katalin</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((value) => !value)}>Menü</button>
        <nav className="hidden gap-5 text-sm md:flex" aria-label="Katalin koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="px-5 pb-16">
        {page === "home" && (
          <section className="grid items-end gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-[#0e6b62]">Gyenesdiás · 300 méterre a parttól</p>
              <h1 className="font-display mt-3 text-5xl leading-tight">Előbb a ház, aztán a dátum.</h1>
              <p className="mt-4 max-w-xl text-lg leading-8">66 szoba, családi lakosztályok és egy kert, ahol a medence a középpont. A szezonális csomag csak ezután jön.</p>
              <Link href="/p/katalin/foglalas" className="mt-6 inline-block rounded-full bg-[#0e6b62] px-5 py-3 text-[#f4efe6]">Szobát nézek</Link>
            </div>
            <div className="grid gap-3">
              {[
                ["Családoknak", "Játszóház, pancsoló, 39 méteres csúszda."],
                ["Pároknak", "Csendes, 16 éven felüli wellnessrész."],
                ["Kert", "12 000 m², a régió virágos kertje a szálloda saját szövege szerint."],
              ].map(([title, text]) => (
                <article key={title} className="rounded-2xl bg-white p-4">
                  <h2 className="font-display text-2xl">{title}</h2>
                  <p className="mt-1 text-sm leading-6">{text}</p>
                </article>
              ))}
            </div>
          </section>
        )}
        {page === "szobak" && (
          <section>
            <h1 className="font-display text-4xl">Szobák</h1>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {["Standard", "Családi lakosztály", "Pezsgőfürdős szoba"].map((room) => (
                <article key={room} className="rounded-2xl bg-[#dceee9] p-5">
                  <h2 className="font-display text-2xl">{room}</h2>
                  <p className="mt-2 text-sm leading-6">A pontos ágyazást a szálloda adja meg. Itt a típus szerepe látszik, nem egy kitalált ár.</p>
                  <Link href="/p/katalin/foglalas" className="mt-3 inline-block text-sm underline">Ezt kérem</Link>
                </article>
              ))}
            </div>
          </section>
        )}
        {page === "wellness" && (
          <section className="max-w-3xl">
            <h1 className="font-display text-4xl">Két ritmus egy kertben</h1>
            <p className="mt-4 leading-8">A családi oldalon csúszda, pancsoló és szaunák. A csendes rész a felnőtteké. A koncepció nem keveri a kettőt egyetlen „wellness” szóba.</p>
            <Link href="/p/katalin/foglalas" className="mt-6 inline-block underline">Időpont a házhoz, nem egy új spa-motor</Link>
          </section>
        )}
        {page === "ajanlatok" && <Offers />}
        {page === "foglalas" && (
          <section className="max-w-lg">
            <h1 className="font-display text-4xl">Foglalási szándék</h1>
            <p className="mt-2 text-sm">A demó nem köti össze a foglalasirendszer.hu motort.</p>
            <form className="mt-4 space-y-3" onSubmit={(event) => form.submit(event, "A szándék")} noValidate>
              <Field id="k-name" label="Név" error={form.errors.name}><TextInput id="k-name" name="name" error={form.errors.name} /></Field>
              <Field id="k-email" label="E-mail" error={form.errors.email}><TextInput id="k-email" name="email" type="email" error={form.errors.email} /></Field>
              <Field id="k-message" label="Mikor és hányan" error={form.errors.message}><TextArea id="k-message" error={form.errors.message} /></Field>
              <button className="rounded-full bg-[#0e6b62] px-4 py-2 text-[#f4efe6]" type="submit">Ellenőrzés</button>
              {form.done && <p role="status">{form.done}</p>}
            </form>
          </section>
        )}
        {!["home", "szobak", "wellness", "ajanlatok", "foglalas"].includes(page) && <Missing href="/p/katalin" />}
      </main>
    </div>
  )
}

function Offers() {
  const [who, setWho] = useState("mind")
  const items = [
    { who: "csalad", title: "Téli szünet", text: "A szálloda saját csomagneve, ár nélkül." },
    { who: "par", title: "Romantikus napok", text: "Pezsgőfürdős szoba, a részleteket a ház adja." },
    { who: "csalad", title: "Mikulás hétvége", text: "Időszakos program, nem a ház állandó arca." },
  ]
  const shown = items.filter((item) => who === "mind" || item.who === who)
  return (
    <section>
      <h1 className="font-display text-4xl">Időszakos csomagok</h1>
      <div className="mt-4 flex gap-2">
        {[
          ["mind", "Mind"],
          ["csalad", "Család"],
          ["par", "Pár"],
        ].map(([value, label]) => (
          <button key={value} type="button" aria-pressed={who === value} className="rounded-full border px-3 py-1 text-sm" onClick={() => setWho(value)}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {shown.map((item) => (
          <article key={item.title} className="rounded-2xl bg-white p-4">
            <h2 className="font-display text-2xl">{item.title}</h2>
            <p className="mt-2 text-sm">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Kolping({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const [age, setAge] = useState("3-6")
  const form = useLeadForm()
  const links = [
    ["/p/kolping", "Otthon"],
    ["/p/kolping/korosztaly", "Korosztály"],
    ["/p/kolping/furdo", "Fürdő"],
    ["/p/kolping/szobak", "Szobák"],
    ["/p/kolping/foglalas", "Foglalás"],
  ].map(([href, label]) => ({ href, label }))
  const ages: Record<string, string> = {
    "0-2": "Bababarát ritmus: rövid program, csendes óra, saját tempó.",
    "3-6": "Ovis kaland: rövid foglalkozás és a családi fürdő.",
    "7+": "Szünidő: több önálló program, a szülőknek csendes sáv.",
  }
  return (
    <div className="min-h-screen bg-[#f6f1e4] text-[#234237]">
      <Banner name="Kolping Family Resort" />
      <header className="flex items-center justify-between px-5 py-4">
        <Link href="/p/kolping" className="font-display text-2xl">Kolping</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((value) => !value)}>Menü</button>
        <nav className="hidden gap-4 text-sm md:flex" aria-label="Kolping koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="px-5 pb-16">
        {page === "home" && (
          <section>
            <p className="text-sm uppercase tracking-[0.14em]">Alsópáhok</p>
            <h1 className="font-display mt-2 max-w-3xl text-5xl leading-tight">A kor a első választás.</h1>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {Object.entries(ages).map(([key, text]) => (
                <button key={key} type="button" onClick={() => setAge(key)} className={`rounded-3xl p-5 text-left ${age === key ? "bg-[#234237] text-[#f6f1e4]" : "bg-white"}`}>
                  <span className="font-display text-3xl">{key}</span>
                  <span className="mt-2 block text-sm leading-6">{text}</span>
                </button>
              ))}
            </div>
            <Link href="/p/kolping/foglalas" className="mt-6 inline-block rounded-full bg-[#e2a122] px-5 py-3 text-[#234237]">Dátumot kérek</Link>
          </section>
        )}
        {page === "korosztaly" && (
          <section className="max-w-2xl">
            <h1 className="font-display text-4xl">Három napirend</h1>
            <p className="mt-4 leading-8">A resort saját felosztása: 0–2, 3–6 és 7+. A koncepció nem használja a ház figuráját.</p>
          </section>
        )}
        {page === "furdo" && (
          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl bg-[#d7ebe3] p-6">
              <h1 className="font-display text-3xl">Családi élményfürdő</h1>
              <p className="mt-3 leading-7">A gyerekek vize és a játék. A részletes medencelista a ház anyaga.</p>
            </article>
            <article className="rounded-3xl bg-white p-6">
              <h2 className="font-display text-3xl">Csendes wellness</h2>
              <p className="mt-3 leading-7">Külön sáv azoknak, akik a fürdőből egy órára kilépnének.</p>
            </article>
          </section>
        )}
        {page === "szobak" && (
          <section>
            <h1 className="font-display text-4xl">Családi lakosztályok</h1>
            <p className="mt-3 max-w-xl leading-7">A pontos alaprajzot nem találtuk ki. A foglalás a meglévő motor felé mutathat, ha a resort megnyitja.</p>
          </section>
        )}
        {page === "foglalas" && (
          <form className="max-w-lg space-y-3" onSubmit={(event) => form.submit(event, "A kérés")} noValidate>
            <h1 className="font-display text-4xl">Foglalás</h1>
            <Field id="ko-name" label="Név" error={form.errors.name}><TextInput id="ko-name" name="name" error={form.errors.name} /></Field>
            <Field id="ko-email" label="E-mail" error={form.errors.email}><TextInput id="ko-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="ko-message" label="Korosztály és dátum" error={form.errors.message}><TextArea id="ko-message" error={form.errors.message} /></Field>
            <button type="submit" className="rounded-full bg-[#234237] px-4 py-2 text-[#f6f1e4]">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "korosztaly", "furdo", "szobak", "foglalas"].includes(page) && <Missing href="/p/kolping" />}
      </main>
    </div>
  )
}

export function Ars({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState("vizsgalat")
  const form = useLeadForm()
  const links = [
    ["/p/arsmedica", "Belépő"],
    ["/p/arsmedica/szakmak", "Szakmák"],
    ["/p/arsmedica/mutet", "Műtét"],
    ["/p/arsmedica/orvosok", "Orvosok"],
    ["/p/arsmedica/bejelentkezes", "Bejelentkezés"],
  ].map(([href, label]) => ({ href, label }))
  const specs = ["Fül-orr-gégészet", "Bőrgyógyászat", "Diabetológia", "Gasztroenterológia", "Baleseti sebészet"]
  return (
    <div className="min-h-screen bg-[#fbf7f4] text-[#3c2428]">
      <Banner name="Ars Medica Magánkórház" />
      <header className="flex items-center justify-between border-b border-[#eadfd8] px-5 py-4">
        <Link href="/p/arsmedica" className="font-display text-2xl">Ars Medica</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Menü</button>
        <nav className="hidden gap-4 text-sm md:flex" aria-label="Ars Medica koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="px-5 py-8">
        {page === "home" && (
          <section className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm">Budapest V., Petőfi Sándor utca 3.</p>
              <h1 className="font-display mt-3 text-5xl leading-tight">Mit keres: vizsgálatot vagy műtétet?</h1>
            </div>
            <div className="grid gap-3">
              {[
                ["vizsgalat", "Vizsgálat", "Szakrendelés, beutaló nélkül, a kórház saját szövege szerint."],
                ["mutet", "Műtét", "Egynapos út. A részleteket az orvos mondja el, nem ez az oldal."],
                ["ar", "Árlista", "A szám a kórház listáján marad. Itt csak az út látszik."],
              ].map(([id, title, text]) => (
                <button key={id} type="button" onClick={() => setKind(id)} className={`rounded-xl border p-4 text-left ${kind === id ? "border-[#6e2430] bg-white" : "border-[#eadfd8] bg-white"}`}>
                  <h2 className="font-display text-2xl">{title}</h2>
                  <p className="mt-1 text-sm leading-6">{text}</p>
                </button>
              ))}
              <Link href={kind === "mutet" ? "/p/arsmedica/mutet" : "/p/arsmedica/bejelentkezes"} className="text-sm underline">Tovább</Link>
            </div>
          </section>
        )}
        {page === "szakmak" && (
          <section>
            <h1 className="font-display text-4xl">Szakmák</h1>
            <ul className="mt-4 divide-y divide-[#eadfd8]">
              {specs.map((item) => (
                <li key={item} className="flex items-center justify-between py-3">
                  <span>{item}</span>
                  <Link href="/p/arsmedica/bejelentkezes" className="text-sm underline">Időpont</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {page === "mutet" && (
          <section className="max-w-2xl">
            <h1 className="font-display text-4xl">Műtéti út</h1>
            <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7">
              <li>Konzultáció és a kórház által kért vizsgálatok.</li>
              <li>Időpont, ha az orvos javasolja.</li>
              <li>Az előleg és a részlet a kórház szabálya, ezt nem értelmezzük.</li>
              <li>Kontroll a kórház rendje szerint.</li>
            </ol>
          </section>
        )}
        {page === "orvosok" && (
          <section>
            <h1 className="font-display text-4xl">Orvosok</h1>
            <p className="mt-3 max-w-xl leading-7">Neveket nem írunk a koncepcióba, amíg a kórház nem adja át a listát. A helyük itt van: szakma, rendelési idő, nyelv.</p>
          </section>
        )}
        {page === "bejelentkezes" && (
          <form className="max-w-lg space-y-3" onSubmit={(event) => form.submit(event, "A bejelentkezés")} noValidate>
            <h1 className="font-display text-4xl">Bejelentkezés</h1>
            <p className="text-sm">Leletet és kórtörténetet nem kérünk.</p>
            <Field id="a-name" label="Név" error={form.errors.name}><TextInput id="a-name" name="name" error={form.errors.name} /></Field>
            <Field id="a-email" label="E-mail" error={form.errors.email}><TextInput id="a-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="a-message" label="Szakma és napszak" error={form.errors.message}><TextArea id="a-message" error={form.errors.message} /></Field>
            <button type="submit" className="rounded-full bg-[#6e2430] px-4 py-2 text-white">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "szakmak", "mutet", "orvosok", "bejelentkezes"].includes(page) && <Missing href="/p/arsmedica" />}
      </main>
    </div>
  )
}

export function Sanat({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const [area, setArea] = useState("mind")
  const form = useLeadForm()
  const links = [
    ["/p/sanatmetal", "Áttekintés"],
    ["/p/sanatmetal/termekek", "Termékek"],
    ["/p/sanatmetal/termek", "Sanat Swing"],
    ["/p/sanatmetal/minoseg", "Minőség"],
    ["/p/sanatmetal/kapcsolat", "Kapcsolat"],
  ].map(([href, label]) => ({ href, label }))
  const products = [
    { name: "Sanat Swing", area: "traumatologia", text: "A főoldal klinikai utánkövetést ígér. A számokat nem ismételjük." },
    { name: "Sanat Spine", area: "gerinc", text: "Gerincsebészeti család, saját oldalra való." },
    { name: "Sanat Sport", area: "sport", text: "Sportsebészet, külön közönség." },
    { name: "Sanat Smile", area: "fogaszat", text: "A jelenlegi oldal szerint hamarosan." },
  ]
  const shown = products.filter((item) => area === "mind" || item.area === area)
  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#172027]">
      <Banner name="Sanatmetal" />
      <header className="flex items-center justify-between px-5 py-4">
        <Link href="/p/sanatmetal" className="font-display text-2xl">Sanatmetal</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Menü</button>
        <nav className="hidden gap-4 text-sm md:flex" aria-label="Sanatmetal koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="px-5 pb-16">
        {page === "home" && (
          <section>
            <p className="text-sm">Eger · magyar tulajdonú gyártó</p>
            <h1 className="font-display mt-2 max-w-3xl text-5xl">Egy család, egy közönség.</h1>
            <p className="mt-4 max-w-2xl leading-8">A traumatológia, a gerinc és a fogászat nem ugyanaz a nyitóoldal. A kapcsolat a választott család alatt van.</p>
          </section>
        )}
        {page === "termekek" && (
          <section>
            <h1 className="font-display text-4xl">Termékkörök</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["mind", "Mind"],
                ["traumatologia", "Traumatológia"],
                ["gerinc", "Gerinc"],
                ["sport", "Sport"],
                ["fogaszat", "Fogászat"],
              ].map(([value, label]) => (
                <button key={value} type="button" aria-pressed={area === value} className="rounded-full border px-3 py-1 text-sm" onClick={() => setArea(value)}>{label}</button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {shown.map((item) => (
                <article key={item.name} className="rounded-xl bg-white p-4">
                  <h2 className="text-xl">{item.name}</h2>
                  <p className="mt-2 text-sm leading-6">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}
        {page === "termek" && (
          <section className="max-w-2xl">
            <h1 className="font-display text-4xl">Sanat Swing</h1>
            <p className="mt-4 leading-8">A cég nyilvános mondata: valós klinikai adatok és publikált utánkövetés. A koncepció helyet ad a hivatkozásnak, de nem gyárt új állítást.</p>
            <Link href="/p/sanatmetal/kapcsolat" className="mt-4 inline-block underline">Szakmai érdeklődés</Link>
          </section>
        )}
        {page === "minoseg" && (
          <section className="max-w-2xl">
            <h1 className="font-display text-4xl">Minőség</h1>
            <p className="mt-4 leading-8">Az MDR-megfelelést a cég említi. A dokumentumtár külön munka, nincs ebben a prototípusban.</p>
          </section>
        )}
        {page === "kapcsolat" && (
          <form className="max-w-lg space-y-3" onSubmit={(event) => form.submit(event, "Az érdeklődés")} noValidate>
            <h1 className="font-display text-4xl">Kapcsolat</h1>
            <p className="text-sm">Eger, Faiskola út 5. · metal@sanatmetal.hu</p>
            <Field id="s-name" label="Név" error={form.errors.name}><TextInput id="s-name" name="name" error={form.errors.name} /></Field>
            <Field id="s-email" label="E-mail" error={form.errors.email}><TextInput id="s-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="s-message" label="Termékkör és ország" error={form.errors.message}><TextArea id="s-message" error={form.errors.message} /></Field>
            <button type="submit" className="rounded-md bg-[#172027] px-4 py-2 text-white">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "termekek", "termek", "minoseg", "kapcsolat"].includes(page) && <Missing href="/p/sanatmetal" />}
      </main>
    </div>
  )
}

export function Engineering({ page }: { page: string }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const form = useLeadForm()
  const links = [
    ["/p/boengineering", "Feladat"],
    ["/p/boengineering/megoldasok", "Megoldások"],
    ["/p/boengineering/referenciak", "Referenciák"],
    ["/p/boengineering/folyamat", "Folyamat"],
    ["/p/boengineering/ajanlat", "Ajánlat"],
  ].map(([href, label]) => ({ href, label }))
  const refs = [
    { name: "Audi Hungária", text: "Robotizált cellák, a cég nyilvános referenciája." },
    { name: "Bosch Rexroth", text: "Ultrahangos hegesztés gyártósorba illesztése." },
    { name: "Continental", text: "Automatizálás, a részletes eredmény a cégnél van." },
    { name: "Grundfos", text: "Automatizálási feladat a nyilvános listán." },
  ]
  const shown = refs.filter((item) => item.name.toLowerCase().includes(q.toLowerCase()) || item.text.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="min-h-screen bg-[#14171b] text-[#f3efe6]">
      <Banner name="BO Engineering" />
      <header className="flex items-center justify-between px-5 py-4">
        <Link href="/p/boengineering" className="font-display text-2xl">BO Engineering</Link>
        <button type="button" className="md:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Menü</button>
        <nav className="hidden gap-4 text-sm md:flex" aria-label="BO Engineering koncepció">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </header>
      <Menu open={open} links={links} close={() => setOpen(false)} />
      <main className="px-5 pb-16">
        {page === "home" && (
          <section className="max-w-4xl">
            <h1 className="font-display text-5xl leading-tight md:text-7xl">Melyik műveletet vegye át a cella?</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#d9d3c6]">Nem katalógus. Egy felmérés: anyag, ütem, veszélyes lépés.</p>
            <Link href="/p/boengineering/ajanlat" className="mt-8 inline-block bg-[#e8a317] px-5 py-3 text-[#14171b]">Felmérést kérek</Link>
          </section>
        )}
        {page === "megoldasok" && (
          <section className="grid gap-4 md:grid-cols-3">
            {["Robotcella", "Célgép", "Mérnöki tanácsadás"].map((item) => (
              <article key={item} className="border border-white/15 p-5">
                <h1 className="font-display text-3xl">{item}</h1>
                <p className="mt-3 text-sm leading-6 text-[#d9d3c6]">A rész a közös felmérésen dől el. Itt a választás látszik.</p>
              </article>
            ))}
          </section>
        )}
        {page === "referenciak" && (
          <section>
            <h1 className="font-display text-4xl">Három történet helyett egy szűrhető lista</h1>
            <label className="mt-4 block text-sm" htmlFor="refq">Keresés a nyilvános nevek között</label>
            <input id="refq" value={q} onChange={(event) => setQ(event.target.value)} className="mt-1 w-full max-w-sm border border-white/20 bg-transparent px-3 py-2" />
            <ul className="mt-4 divide-y divide-white/15">
              {shown.map((item) => (
                <li key={item.name} className="py-3">
                  <strong>{item.name}</strong>
                  <p className="text-sm text-[#d9d3c6]">{item.text}</p>
                </li>
              ))}
              {shown.length === 0 && <li className="py-3">Nincs ilyen a mintában.</li>}
            </ul>
          </section>
        )}
        {page === "folyamat" && (
          <section>
          <h1 className="font-display text-4xl">Folyamat</h1>
          <ol className="mt-4 max-w-xl list-decimal space-y-3 pl-5 text-lg">
            <li>Helyszíni felmérés.</li>
            <li>Cella vagy célgép koncepció.</li>
            <li>Gyártás és beüzemelés a cég rendje szerint.</li>
          </ol>
          </section>
        )}
        {page === "ajanlat" && (
          <form className="max-w-lg space-y-3" onSubmit={(event) => form.submit(event, "A felmérés")} noValidate>
            <h1 className="font-display text-4xl">Felmérés</h1>
            <Field id="b-name" label="Név" error={form.errors.name}><TextInput id="b-name" name="name" error={form.errors.name} /></Field>
            <Field id="b-email" label="E-mail" error={form.errors.email}><TextInput id="b-email" name="email" type="email" error={form.errors.email} /></Field>
            <Field id="b-message" label="Művelet, anyag, határidő" error={form.errors.message}><TextArea id="b-message" error={form.errors.message} /></Field>
            <button type="submit" className="bg-[#e8a317] px-4 py-2 text-[#14171b]">Ellenőrzés</button>
            {form.done && <p role="status">{form.done}</p>}
          </form>
        )}
        {!["home", "megoldasok", "referenciak", "folyamat", "ajanlat"].includes(page) && <Missing href="/p/boengineering" />}
      </main>
    </div>
  )
}

function Missing({ href }: { href: string }) {
  return (
    <p>
      Ez az oldal nincs a koncepcióban. <Link href={href} className="underline">Vissza a nyitóra</Link>
    </p>
  )
}
