import { Box, render, Text, useApp, useInput } from 'ink'
import TextInput from 'ink-text-input'
import type { ComponentProps, PropsWithChildren } from 'react'
import { App } from '../components/app'
import { InkContext, type InkContextValue } from './context'

export const CliProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const value: InkContextValue = {
    Box,
    Text,
    useApp,
    useInput,
    TextInput,
  }

  return <InkContext.Provider value={value}>{children}</InkContext.Provider>
}

export const Cli = (props: ComponentProps<typeof App>): JSX.Element => {
  return (
    <CliProvider>
      <App {...props} />
    </CliProvider>
  )
}

export { App, render }
