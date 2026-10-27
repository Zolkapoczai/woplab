"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"

export function Banner({ name }: { name: string }) {
  return (
    <p className="bg-neutral-950 px-4 py-2 text-center text-xs leading-5 text-white">
      Koncepció — nem a {name} hivatalos weboldala. Az űrlap csak a böngészőben ellenőriz, üzenetet nem küld.
    </p>
  )
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function useLeadForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState("")
  function submit(event: FormEvent<HTMLFormElement>, noun: string) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get("name") || "").trim()
    const email = String(data.get("email") || "").trim()
    const message = String(data.get("message") || "").trim()
    const next: Record<string, string> = {}
    if (name.length < 2) next.name = "Adja meg a nevét."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Érvényes e-mail cím kell."
    if (message.length < 8) next.message = "Írjon legalább egy rövid mondatot."
    setErrors(next)
    setDone(Object.keys(next).length ? "" : `${noun} rögzítve a böngészőben. Elküldés nem történt.`)
  }
  return { errors, done, submit }
}

export function TextInput({ id, name, type = "text", error }: { id: string; name: string; type?: string; error?: string }) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900"
    />
  )
}

export function TextArea({ id, error }: { id: string; error?: string }) {
  return (
    <textarea
      id={id}
      name="message"
      rows={4}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900"
    />
  )
}

export function SiteLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
