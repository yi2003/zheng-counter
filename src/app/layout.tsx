import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '正 Counter - Traditional Chinese Tally App',
  description: 'Interactive counting app using traditional Chinese tally marks with 正 character - each stroke counts as 1, complete character equals 5',
  keywords: 'Chinese, tally, counting, traditional, 正, cultural, interactive',
  authors: [{ name: 'Zheng Counter App' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>{children}</body>
    </html>
  )
}
