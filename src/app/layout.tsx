import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ReduxProvider } from '@/redux/provider'
import HeaderDefault from '@/components/HeaderDefault'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} max-w-3xl mx-auto my-0`}>
        <ReduxProvider>
          <HeaderDefault />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
