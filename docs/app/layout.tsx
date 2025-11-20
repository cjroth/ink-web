import { RootProvider } from 'fumadocs-ui/provider/next'
import localFont from 'next/font/local'
import './global.css'

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
    <html lang="en" className={monaspace.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
