"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "cn"

const links = [
  { href: "/", label: "Áttekintés" },
  { href: "/discovery", label: "Felfedezés" },
  { href: "/audits", label: "Auditok" },
  { href: "/redesigns", label: "Redesign" },
  { href: "/proposals", label: "Ajánlatok" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/settings", label: "Módszertan" },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Labor" className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted",
            )}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
      <div className="min-h-screen bg-background text-foreground">
        <a href="#tartalom" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
          Ugrás a tartalomhoz
        </a>
        <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-border px-4 py-6 md:block">
            <Link href="/" className="font-display text-xl leading-tight">
              Website Opportunity Lab
            </Link>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Belső ügyfélszerző műhely. 2026. október 27.</p>
            <div className="mt-6">
              <NavLinks />
            </div>
          </aside>
          <div>
            <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
              <Link href="/" className="font-display text-lg">
                Opportunity Lab
              </Link>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Menü megnyitása">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Navigáció</SheetTitle>
                  </SheetHeader>
                  <div className="px-4">
                    <NavLinks onNavigate={() => setOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </header>
            <main id="tartalom" className="px-4 py-6 md:px-8 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
  )
}
