import type { ProposalPatch, ProposalSeed, Settings } from "./types"

export type PricedLine = {
  id: string
  bucket: ProposalSeed["lines"][number]["bucket"]
  label: string
  detail: string
  hours: number
  rate: number
  rateKey: ProposalSeed["lines"][number]["rateKey"]
  included: boolean
  net: number
  internal: number
}

export type PricedProposal = {
  lines: PricedLine[]
  discountPct: number
  deliveryNet: number
  discountValue: number
  deliveryAfterDiscount: number
  externalNet: number
  licenseNet: number
  oneTimeNet: number
  vat: number
  oneTimeGross: number
  maintenanceEnabled: boolean
  maintenanceMonthly: number
  maintenanceYear: number
  internalDelivery: number
  internalPrep: number
}

function bucketNet(lines: PricedLine[], bucket: PricedLine["bucket"]) {
  return lines.filter((line) => line.included && line.bucket === bucket).reduce((sum, line) => sum + line.net, 0)
}

export function priceProposal(seed: ProposalSeed, settings: Settings, patch?: ProposalPatch): PricedProposal {
  const lines: PricedLine[] = seed.lines.map((line) => {
    const edit = patch?.lines?.[line.id]
    const hours = edit?.hours ?? line.hours
    const rate = edit?.rate ?? settings.sellRates[line.rateKey]
    const included = edit?.included ?? line.included
    const internalRate = settings.internalRates[line.rateKey]
    const safeHours = Number.isFinite(hours) ? Math.max(0, hours) : 0
    const safeRate = Number.isFinite(rate) ? Math.max(0, rate) : 0
    return {
      id: line.id,
      bucket: line.bucket,
      label: line.label,
      detail: line.detail,
      hours: safeHours,
      rate: safeRate,
      rateKey: line.rateKey,
      included,
      net: included ? Math.round(safeHours * safeRate) : 0,
      internal: included ? Math.round(safeHours * internalRate) : 0,
    }
  })
  const discountPct = Math.min(40, Math.max(0, patch?.discountPct ?? seed.discountPct))
  const deliveryNet = bucketNet(lines, "delivery")
  const discountValue = Math.round(deliveryNet * (discountPct / 100))
  const deliveryAfterDiscount = deliveryNet - discountValue
  const externalNet = bucketNet(lines, "external")
  const licenseNet = bucketNet(lines, "license")
  const oneTimeNet = deliveryAfterDiscount + externalNet + licenseNet
  const vat = Math.round(oneTimeNet * settings.vatRate)
  const maintenanceMonthly = Math.max(0, patch?.maintenanceMonthly ?? seed.maintenanceMonthly)
  const maintenanceEnabled = patch?.maintenanceEnabled ?? false
  const internalDelivery = lines
    .filter((line) => line.included && line.bucket === "delivery")
    .reduce((sum, line) => sum + line.internal, 0)
  const internalPrep = Math.round(
    seed.prepAuditHours * settings.internalRates.pm + seed.prepPrototypeHours * settings.internalRates.dev,
  )
  return {
    lines,
    discountPct,
    deliveryNet,
    discountValue,
    deliveryAfterDiscount,
    externalNet,
    licenseNet,
    oneTimeNet,
    vat,
    oneTimeGross: oneTimeNet + vat,
    maintenanceEnabled,
    maintenanceMonthly,
    maintenanceYear: maintenanceMonthly * 12,
    internalDelivery,
    internalPrep,
  }
}
