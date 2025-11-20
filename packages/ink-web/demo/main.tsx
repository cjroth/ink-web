import React from 'react'
import 'xterm/css/xterm.css'
// In a real app, this would be: import { mountInkInXterm, DemoApp } from 'ink-web'
import { DemoApp, mountInkInXterm } from '../dist/index.js'

console.log('React version:', React.version)

const container = document.getElementById('terminal')!
mountInkInXterm(<DemoApp />, { container, focus: true })
