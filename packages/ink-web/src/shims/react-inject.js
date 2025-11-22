// This file is injected by esbuild to provide React as a module
// It prevents dynamic require() errors for React
import * as ReactNamespace from 'react'
import * as ReactDOMNamespace from 'react-dom'

export const React = ReactNamespace
export const ReactDOM = ReactDOMNamespace
export default ReactNamespace

