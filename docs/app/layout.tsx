import { RootProvider } from 'fumadocs-ui/provider/next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/next"
import { Footer } from '@/lib/layout.shared'
import type { Metadata } from 'next'
import './global.css'

const siteConfig = {
  name: 'Ink Web',
  title: 'Ink Web - CLIs in the browser & terminal.',
  description: 'Build interactive command-line apps with Ink and React that run in the browser as well as in the terminal.',
  url: 'https://ink-web.dev',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/og-preview.png'],
  },
}

const hubotSans = localFont({
  src: [
    {
      path: '../public/fonts/hubot-sans/HubotSans-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/hubot-sans/HubotSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/hubot-sans/HubotSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/hubot-sans/HubotSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/hubot-sans/HubotSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/hubot-sans/HubotSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/hubot-sans/HubotSans-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/hubot-sans/HubotSans-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-hubot-sans',
  display: 'swap',
})

const monaspace = localFont({
  src: [
    {
      path: '../public/fonts/monaspace/MonaspaceNeonVar.woff2',
      weight: '200 800',
      style: 'normal',
    },
  ],
  variable: '--font-monaspace',
  display: 'swap',
})

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${hubotSans.className} ${monaspace.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          {children}
          <Footer />
        </RootProvider>
        <Analytics />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="7025e030-677b-4116-8238-6b11d6b582ad" />
      </body>
    </html>
  )
}
