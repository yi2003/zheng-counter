import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '正 Character Practice - Learn Chinese Writing',
  description: 'Interactive app to practice writing the Chinese character 正 (correct/positive) with proper stroke order',
  keywords: 'Chinese, character, writing, practice, 正, stroke order, calligraphy',
  authors: [{ name: 'Zheng Character App' }],
  viewport: 'width=device-width, initial-scale=1',
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
