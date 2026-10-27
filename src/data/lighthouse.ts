export type LabAudit = {
  companyId: string
  url: string
  fetchedAt: string
  performance: number
  accessibility: number
  seo: number
  bestPractices: number
  fcp: string
  lcp: string
  tbt: string
  cls: string
  speedIndex: string
  reading: string
}

const tool = "Lighthouse CLI  mobil, simulated throttling, headless Chrome. Laboradat, nem CrUX terepadat."

export const lighthouseTool = tool

export const labAudits: LabAudit[] = [
  {
    companyId: "katalin",
    url: "https://www.hotelkatalin.hu/",
    fetchedAt: "2026-10-27T17:20:01+01:00",
    performance: 68,
    accessibility: 90,
    seo: 92,
    bestPractices: 96,
    fcp: "1,8 s",
    lcp: "5,8 s",
    tbt: "340 ms",
    cls: "0",
    speedIndex: "3,5 s",
    reading: "A labor LCP 5,8 s. A title-hiba ettől független: a Lighthouse SEO pontja nem a tömött megfogalmazást bünteti.",
  },
  {
    companyId: "kolping",
    url: "https://kolping.hotel.hu/",
    fetchedAt: "2026-10-27T17:20:15+01:00",
    performance: 58,
    accessibility: 81,
    seo: 92,
    bestPractices: 96,
    fcp: "2,9 s",
    lcp: "8,3 s",
    tbt: "250 ms",
    cls: "0",
    speedIndex: "8,4 s",
    reading: "A szimulált mobilon a legnagyobb tartalom 8,3 s. Ez labor, nem a vendégek mért élménye.",
  },
  {
    companyId: "arsmedica",
    url: "https://www.arsmedica.hu/",
    fetchedAt: "2026-10-27T17:20:34+01:00",
    performance: 65,
    accessibility: 86,
    seo: 100,
    bestPractices: 100,
    fcp: "3,7 s",
    lcp: "7,0 s",
    tbt: "90 ms",
    cls: "0",
    speedIndex: "5,1 s",
    reading: "A SEO pont 100, a két h1 és a JSON-LD hiánya ettől még a HTML-ben igazolt. A Lighthouse SEO kategóriája nem fedi ezeket.",
  },
  {
    companyId: "sanatmetal",
    url: "https://sanatmetal.hu/",
    fetchedAt: "2026-10-27T17:20:50+01:00",
    performance: 69,
    accessibility: 79,
    seo: 75,
    bestPractices: 92,
    fcp: "3,3 s",
    lcp: "4,6 s",
    tbt: "90 ms",
    cls: "0",
    speedIndex: "8,4 s",
    reading: "Az akadálymentességi pont 79, összhangban a címsor- és alt-hibákkal. A tíz h1-et a saját parser számolta.",
  },
  {
    companyId: "boengineering",
    url: "https://boengineering.hu/",
    fetchedAt: "2026-10-27T17:21:18+01:00",
    performance: 52,
    accessibility: 74,
    seo: 92,
    bestPractices: 92,
    fcp: "10,5 s",
    lcp: "24,1 s",
    tbt: "200 ms",
    cls: "0,004",
    speedIndex: "13,6 s",
    reading: "A labor LCP 24,1 s. Ez a shortlist leglassabb szimulált fő tartalma. Nem terepadat, de a slideres főoldal indoka elég a külön vizsgálathoz.",
  },
  {
    companyId: "becsi",
    url: "https://becsiautopark.hu/",
    fetchedAt: "2026-10-27T17:21:45+01:00",
    performance: 78,
    accessibility: 87,
    seo: 92,
    bestPractices: 54,
    fcp: "2,4 s",
    lcp: "3,8 s",
    tbt: "160 ms",
    cls: "0,036",
    speedIndex: "6,6 s",
    reading: "A betöltés a laborban közepes. A best practices pont 54, a nyilvános Elementor-verzióval együtt üzemeltetési kérdés, nem igazolt betörés.",
  },
  {
    companyId: "himesudvar",
    url: "https://www.himesudvar.hu/",
    fetchedAt: "2026-10-27T17:22:08+01:00",
    performance: 85,
    accessibility: 93,
    seo: 40,
    bestPractices: 96,
    fcp: "0,9 s",
    lcp: "2,1 s",
    tbt: "550 ms",
    cls: "0,009",
    speedIndex: "0,9 s",
    reading: "A labor SEO pont 40. Ez egybevág a html lang=en jelöléssel. A lap a szimulációban nem lassú.",
  },
  {
    companyId: "metrodom",
    url: "https://metrodom.hu/",
    fetchedAt: "2026-10-27T17:22:24+01:00",
    performance: 43,
    accessibility: 77,
    seo: 83,
    bestPractices: 73,
    fcp: "2,7 s",
    lcp: "22,1 s",
    tbt: "900 ms",
    cls: "0",
    speedIndex: "7,3 s",
    reading: "A labor LCP 22,1 s, a teljes blokkolás 900 ms. A „kezdőoldal” title ettől külön SEO-hiba.",
  },
  {
    companyId: "gundel",
    url: "https://gundel.hu/",
    fetchedAt: "2026-10-27T17:22:50+01:00",
    performance: 90,
    accessibility: 91,
    seo: 100,
    bestPractices: 96,
    fcp: "2,0 s",
    lcp: "3,3 s",
    tbt: "0 ms",
    cls: "0",
    speedIndex: "3,3 s",
    reading: "A labor szerint a főoldal gyors. Az üres alt és a hiányzó h1 ettől még igazolt. A magas pont nem menti fel a hierarchiát.",
  },
]
