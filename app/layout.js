import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Provider } from './provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata = {
  title: 'MailCraft AI - AI-Driven Email Templates',
  description: 'Create beautiful email templates with AI',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/mail.png', type: 'image/png', sizes: '32x32' },
      { url: '/mail.png', type: 'image/png', sizes: '16x16' },
      { url: '/mail.png', type: 'image/png', sizes: '48x48' },
    ],
    apple: [
      { url: '/mail.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: [
      { url: '/favicon.svg' }
    ],
  },
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
        
        <Toaster/>
      </body>
    </html>
  )
}
