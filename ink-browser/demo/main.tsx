import { Box, Text } from 'ink'
import React from 'react'
import 'xterm/css/xterm.css'
// In a real app, this would be: import { mountInkInXterm } from '@ink-web/browser'
import { mountInkInXterm } from '../dist/index.js'

const App = () => React.createElement(Box, { flexDirection: 'column' }, React.createElement(Text, { color: 'green' }, 'Ink + Xterm (browser)'), React.createElement(Text, null, 'Type something...'))

const container = document.getElementById('terminal')!
mountInkInXterm(React.createElement(App), { container, focus: true })
