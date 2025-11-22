import { RootProvider } from 'fumadocs-ui/provider/next'
import localFont from 'next/font/local'
import './global.css'

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
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
