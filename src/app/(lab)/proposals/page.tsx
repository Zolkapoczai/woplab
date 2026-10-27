"use client"

import Link from "next/link"
import { useLab, usePriced } from "@/components/lab/provider"
import { huf, hufCompact } from "@/lib/format"
import { priceProposal } from "@/lib/pricing"
import { rankCompanies } from "@/lib/scoring"

export default function ProposalsPage() {
  const { companies, settings, proposals } = useLab()
  const selected = rankCompanies(companies.filter((item) => item.selected), settings)
  const rows = selected.map((company) => {
    const seed = proposals.find((item) => item.companyId === company.id)!
    return { company, seed }
  })
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Ajánlatok</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Mind a tíz shortlist cégnek saját scope-ja van. A prototípus ára nincs benne: az belső előkészítés. Az összegek nettók, amíg a scope nincs aláírva.
        </p>
      </header>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Kivitelezési ajánlatok</caption>
          <thead className="bg-muted/60 text-xs uppercase">
            <tr>
              {["Cég", "Nettó díj", "Belső költség", "Havi opció", "Oldalak"].map((head) => (
                <th key={head} scope="col" className="px-3 py-2 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ company }) => (
              <ProposalRow key={company.id} id={company.id} name={company.name} />
            ))}
          </tbody>
        </table>
      </div>
      <Totals />
    </div>
  )
}

function ProposalRow({ id, name }: { id: string; name: string }) {
  const priced = usePriced(id)
  if (!priced) return null
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-3">
        <Link href={`/proposals/${id}`} className="font-medium hover:underline">{name}</Link>
      </td>
      <td className="px-3 py-3">{huf(priced.priced.oneTimeNet)}</td>
      <td className="px-3 py-3">{huf(priced.priced.internalDelivery + priced.priced.internalPrep)}</td>
      <td className="px-3 py-3">{huf(priced.priced.maintenanceMonthly)}</td>
      <td className="px-3 py-3">{priced.seed.pages.length}</td>
    </tr>
  )
}

function Totals() {
  const { proposals, settings, proposalPatch } = useLab()
  const all = proposals.map((seed) => priceProposal(seed, settings, proposalPatch(seed.companyId)))
  const net = all.reduce((sum, item) => sum + item.oneTimeNet, 0)
  const internal = all.reduce((sum, item) => sum + item.internalDelivery + item.internalPrep, 0)
  const care = all.reduce((sum, item) => sum + item.maintenanceMonthly, 0)
  return (
    <p className="text-sm leading-6">
      Tíz ajánlat nettója: {hufCompact(net)}. Belső kivitelezés és előkészítés: {hufCompact(internal)}. Opcionális havi díjak összege: {hufCompact(care)}.
    </p>
  )
}
