import type { Settings } from "@/lib/types"

export const defaultSettings: Settings = {
  weights: {
    businessValue: 20,
    opportunities: 25,
    websiteRole: 20,
    traffic: 15,
    feasibility: 10,
    salesAccess: 10,
  },
  sellRates: {
    design: 32000,
    dev: 30000,
    content: 24000,
    pm: 28000,
    qa: 22000,
  },
  internalRates: {
    design: 18000,
    dev: 17000,
    content: 12000,
    pm: 16000,
    qa: 11000,
  },
  vatRate: 0.27,
  currency: "HUF",
  dataUpdatedAt: "2026-10-27",
  pricingNotes: [
    "Minden ügyfélár nettó becslés. A 27%-os áfa akkor kerül a végösszegre, ha a teljesítés magyar áfás szolgáltatás; ezt szerződés előtt kell megerősíteni.",
    "Az óradíjak egy senior, kis létszámú termékcsapat 2026-os értékesítési és belső költségfeltételezései, nem közbeszerzési díjtétel.",
    "A kedvezmény csak a kivitelezési tételeket csökkenti. A külső gyártói és licencsorok külön kapcsolhatók.",
    "A prototípus és az audit belső előkészítési költség, nem az éles weboldal ára.",
    "Az ár addig becslés, amíg a végleges oldalszám, nyelv és integráció nincs közösen rögzítve.",
    "Bevételnövekedést a modell nem ígér. A várható hatás hipotézis, amit a bevezetés után mérni kell.",
  ],
  securityRules: [
    "Csak nyilvános, passzív, nem destruktív megfigyelés: HTTPS-kézfogás, válaszfejlécek, süti attribútumok, robots.txt, nyilvános HTML.",
    "Nincs behatolás, exploit, brute force, hitelesítés megkerülése, adatkimentés vagy terheléses teszt.",
    "A hiányzó biztonsági fejléc önmagában nem kihasználható sérülékenység.",
    "A négy minősítés: igazolt konfigurációs probléma, dokumentált sérülékenységi jel, további vizsgálatot igénylő gyanú, illetve nem észlelt probléma az elvégzett ellenőrzésen.",
  ],
  auditCriteria: [
    "UX: értékajánlat, navigáció, CTA, bizalom, mobilos használhatóság a nyilvános HTML és a látható szöveg alapján.",
    "Design és tartalom: tipográfia, hierarchia, márka és a cél közönség illeszkedése. Egy oldal nem elavult csak azért, mert nem követ egy trendet.",
    "Teljesítmény: laborpontszám csak akkor szerepel, ha a mérés lefutott. A PageSpeed terepadatát nem helyettesítjük becsléssel.",
    "SEO: title, meta leírás, címsorok, kanonikus jelzés, robots.txt, sitemap-utalás, strukturált adat.",
    "Akadálymentesség: automatikus HTML-jelek (lang, alt, címsor, űrlap) és külön jelölt manuális olvasás. Ez nem teljes WCAG-audit.",
    "Biztonság: a fenti passzív szabályok szerint.",
    "Konverzió: az ajánlatkérés, foglalás vagy vásárlás útvonalának nyilvános súrlódása. Konverziós arányt analitika nélkül nem állítunk.",
  ],
  researchSources: [
    "A cégek saját nyilvános weboldala, 2026-10-27-i letöltéssel.",
    "HTTP válaszfejlécek, TLS-tanúsítvány és robots.txt ugyanerről a napról.",
    "Google PageSpeed Insights API: 2026-10-27-én HTTP 429, napi kvóta 0, ezért ebből a forrásból nincs pontszám.",
    "Helyi Lighthouse CLI mobil labor, ha a mérési fájl elkészült. Ez laboradat, nem CrUX terepadat.",
    "Nyilvános keresőtalálatok csak ott, ahol a közvetlen oldalidézet és az URL együtt szerepel. Forgalmi látogatószámot nem becsültünk.",
  ],
}

export function mergeSettings(base: Settings, patch?: PersistedSettingsPatch): Settings {
  if (!patch) return base
  return {
    ...base,
    ...patch,
    weights: { ...base.weights, ...patch.weights },
    sellRates: { ...base.sellRates, ...patch.sellRates },
    internalRates: { ...base.internalRates, ...patch.internalRates },
    pricingNotes: patch.pricingNotes || base.pricingNotes,
    securityRules: patch.securityRules || base.securityRules,
    auditCriteria: patch.auditCriteria || base.auditCriteria,
    researchSources: patch.researchSources || base.researchSources,
  }
}

type PersistedSettingsPatch = Partial<Settings>
