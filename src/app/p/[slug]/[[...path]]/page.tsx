"use client"

import type { ComponentType } from "react"
import { useParams } from "next/navigation"
import { Ars, Engineering, Katalin, Kolping, Sanat } from "@/prototypes/sites-a"
import { Becsi, Gundel, Himes, Metrodom, TransSped } from "@/prototypes/sites-b"

const views: Record<string, ComponentType<{ page: string }>> = {
  katalin: Katalin,
  kolping: Kolping,
  arsmedica: Ars,
  sanatmetal: Sanat,
  boengineering: Engineering,
  becsi: Becsi,
  himesudvar: Himes,
  metrodom: Metrodom,
  transsped: TransSped,
  gundel: Gundel,
}

export default function PrototypePage() {
  const params = useParams<{ slug: string; path?: string[] }>()
  const View = views[params.slug]
  if (!View) return <main className="p-8">Nincs ilyen prototípus.</main>
  const page = params.path?.[0] ?? "home"
  return <View page={page} />
}
