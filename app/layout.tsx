import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Starterpack IT Student',
  description: 'Manage your academic life with ease',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen bg-cream font-inter">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#25344F',
              color: '#F5F0E8',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#D5B893',
                secondary: '#F5F0E8',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#632024',
                secondary: '#F5F0E8',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
