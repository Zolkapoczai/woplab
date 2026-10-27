"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { companies as seedCompanies } from "@/data/companies"
import { findings } from "@/data/findings"
import { proposals } from "@/data/proposals"
import { defaultSettings, mergeSettings } from "@/data/settings"
import { priceProposal } from "@/lib/pricing"
import { scoreCompany } from "@/lib/scoring"
import { loadState, saveState } from "@/lib/storage"
import type { CompanyPatch, PersistedState, PipelinePatch, ProposalPatch, Settings } from "@/lib/types"

type LiveCompany = (typeof seedCompanies)[number] & {
  pipelineNote: string
}

type LabContextValue = {
  ready: boolean
  settings: Settings
  companies: LiveCompany[]
  findings: typeof findings
  proposals: typeof proposals
  updateSettings: (patch: Partial<Settings>) => void
  updateCompany: (id: string, patch: CompanyPatch) => void
  updatePipeline: (id: string, patch: PipelinePatch) => void
  updateProposal: (id: string, patch: ProposalPatch) => void
  proposalPatch: (id: string) => ProposalPatch | undefined
  resetAll: () => void
}

const LabContext = createContext<LabContextValue | null>(null)

export function LabProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>({ version: 1 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setPersisted(loadState())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveState(persisted)
  }, [persisted, ready])

  const settings = useMemo(() => mergeSettings(defaultSettings, persisted.settings), [persisted.settings])

  const companies = useMemo(() => {
    return seedCompanies.map((company) => {
      const companyPatch = persisted.companies?.[company.id]
      const pipeline = persisted.pipeline?.[company.id]
      return {
        ...company,
        internalNotes: companyPatch?.internalNotes ?? company.internalNotes,
        clientSummary: companyPatch?.clientSummary ?? company.clientSummary,
        nextAction: pipeline?.nextAction ?? companyPatch?.nextAction ?? company.nextAction,
        pipelineStatus: pipeline?.status ?? company.pipelineStatus,
        pipelineNote: pipeline?.note ?? "",
      }
    })
  }, [persisted.companies, persisted.pipeline])

  const value: LabContextValue = {
    ready,
    settings,
    companies,
    findings,
    proposals,
    updateSettings: (patch) =>
      setPersisted((current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...patch,
          weights: { ...current.settings?.weights, ...patch.weights },
          sellRates: { ...current.settings?.sellRates, ...patch.sellRates },
          internalRates: { ...current.settings?.internalRates, ...patch.internalRates },
        },
      }) as PersistedState),
    updateCompany: (id, patch) =>
      setPersisted((current) => ({
        ...current,
        companies: { ...current.companies, [id]: { ...current.companies?.[id], ...patch } },
      })),
    updatePipeline: (id, patch) =>
      setPersisted((current) => ({
        ...current,
        pipeline: { ...current.pipeline, [id]: { ...current.pipeline?.[id], ...patch } },
      })),
    updateProposal: (id, patch) =>
      setPersisted((current) => ({
        ...current,
        proposals: {
          ...current.proposals,
          [id]: {
            ...current.proposals?.[id],
            ...patch,
            lines: { ...current.proposals?.[id]?.lines, ...patch.lines },
          },
        },
      })),
    proposalPatch: (id) => persisted.proposals?.[id],
    resetAll: () => setPersisted({ version: 1 }),
  }

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>
}

export function useLab() {
  const value = useContext(LabContext)
  if (!value) throw new Error("A labor csak a LabProvider alatt használható.")
  return value
}

export function usePriced(companyId: string) {
  const { proposals: seeds, settings, proposalPatch } = useLab()
  const seed = seeds.find((item) => item.companyId === companyId)
  if (!seed) return null
  return { seed, priced: priceProposal(seed, settings, proposalPatch(companyId)) }
}

export function useScore(companyId: string) {
  const { companies, settings } = useLab()
  const company = companies.find((item) => item.id === companyId)
  if (!company) return null
  return { company, score: scoreCompany(company, settings) }
}
