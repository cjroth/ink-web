import React from 'react'
// In a real app, this would be: import { mountInk, DemoApp } from 'ink-web'
import { DemoApp, mountInk } from '../dist/standalone.js'

console.log('React version:', React.version)

const container = document.getElementById('terminal')!
mountInk(<DemoApp />, { container, focus: true })
