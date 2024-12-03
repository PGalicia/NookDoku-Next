/**
 * Imports
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Redux
import { ReduxProvider } from '@/redux/provider'

// Components
import HeaderDefault from '@/components/HeaderDefault'

// Vercel
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NookDoku',
  description: 'Animal Crossing based sudoku game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} max-w-xl mx-auto my-0 bg-primary`}>
        <ReduxProvider>
          <HeaderDefault />
          {children}
          <div className="text-sm text-white/50 text-center uppercase font-mono p-4">@{new Date().getFullYear()} Patrick Galicia • <a className="underline hover:font-bold" href="https://buymeacoffee.com/patrickgalicia" target="_blank">Buy Me A Coffee</a> • Data and images sourced from <a className="underline hover:font-bold" href="https://api.nookipedia.com/" target="_blank">Nookipedia</a></div>
          <Analytics />
        </ReduxProvider>
      </body>
    </html>
  )
}
