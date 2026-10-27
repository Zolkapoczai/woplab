import assert from "node:assert/strict"
import test from "node:test"
import { companies } from "../src/data/companies"
import { findings } from "../src/data/findings"
import { proposals } from "../src/data/proposals"
import { defaultSettings } from "../src/data/settings"
import { toClientCompany, clientViewHasInternalFields } from "../src/lib/client-view"
import { priceProposal } from "../src/lib/pricing"
import { rankCompanies } from "../src/lib/scoring"

test("at least 30 researched companies and exactly 10 selected", () => {
  assert.ok(companies.length >= 30)
  assert.equal(companies.filter((company) => company.selected).length, 10)
})

test("selected companies are the top 10 by the published model", () => {
  const ranked = rankCompanies(companies, defaultSettings).slice(0, 10).map((company) => company.id)
  const selected = companies.filter((company) => company.selected).map((company) => company.id)
  assert.deepEqual(new Set(ranked), new Set(selected))
})

test("every selected company has an audit, a proposal and security clearance", () => {
  for (const company of companies.filter((item) => item.selected)) {
    const own = findings.filter((item) => item.companyId === company.id)
    assert.ok(own.length >= 6, company.id)
    assert.ok(own.some((item) => item.category === "security" && item.securityClass === "clear"), company.id)
    assert.ok(proposals.some((item) => item.companyId === company.id), company.id)
    assert.equal(company.traffic.status, "unavailable")
  }
})

test("proposal edits change the total and can exclude a line", () => {
  const seed = proposals[0]
  const base = priceProposal(seed, defaultSettings)
  const discounted = priceProposal(seed, defaultSettings, { discountPct: 10 })
  assert.ok(discounted.oneTimeNet < base.oneTimeNet)
  const first = seed.lines.find((line) => line.included && line.bucket === "delivery")
  assert.ok(first)
  const without = priceProposal(seed, defaultSettings, { lines: { [first.id]: { included: false } } })
  assert.ok(without.oneTimeNet < base.oneTimeNet)
  assert.equal(base.vat, Math.round(base.oneTimeNet * defaultSettings.vatRate))
})

test("client view hides internal sales fields", () => {
  const company = companies.find((item) => item.selected)
  assert.ok(company)
  const view = toClientCompany(company)
  assert.equal(clientViewHasInternalFields(view), false)
  assert.equal("internalNotes" in view, false)
  assert.equal("scores" in view, false)
  assert.equal("nextAction" in view, false)
  assert.ok(view.clientSummary.length > 20)
})
