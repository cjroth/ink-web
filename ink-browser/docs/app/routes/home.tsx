import { baseOptions } from '@/lib/layout.shared'
import { InkXterm } from '@ink-web/browser'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { Text } from 'ink'
import { Link } from 'react-router'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Fumadocs on React Router.</h1>
        <p className="text-fd-muted-foreground mb-4">The truly flexible docs framework on React.js.</p>
        <InkXterm focus>
          <Text>Hello World</Text>
        </InkXterm>

        <Link className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5" to="/docs">
          Open Docs
        </Link>
      </div>
    </HomeLayout>
  )
}
