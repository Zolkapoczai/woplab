import type { Metadata } from "next"
import { Fraunces, Source_Sans_3 } from "next/font/google"
import { LabProvider } from "@/components/lab/provider"
import "./globals.css"

const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
})

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
})

export const metadata: Metadata = {
  title: "Website Opportunity Lab",
  description: "Magyar vállalati weboldal-audit, redesign és ügyfélszerző műhely.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body className={`${sans.variable} ${display.variable} antialiased`}>
        <LabProvider>{children}</LabProvider>
      </body>
    </html>
  )
}
