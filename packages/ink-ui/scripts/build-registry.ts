#!/usr/bin/env bun
/**
 * Build script for generating shadcn registry files from component source code.
 *
 * This script reads component source files from the components/ directory
 * and generates the registry JSON files needed for shadcn CLI installation.
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const COMPONENTS_DIR = join(import.meta.dir, '../components')
const REGISTRY_DIR = join(import.meta.dir, '../registry')

interface ComponentConfig {
  name: string
  title: string
  description: string
  dependencies?: string[]
  devDependencies?: string[]
}

// Component metadata - add new components here
const COMPONENT_CONFIGS: Record<string, ComponentConfig> = {
  ascii: {
    name: 'ascii',
    title: 'Ascii',
    description: 'Render text as ASCII art using figlet fonts',
    dependencies: ['figlet'],
    devDependencies: ['@types/figlet'],
  },

  gradient: {
    name: 'gradient',
    title: 'Gradient',
    description: 'A gradient color component for terminal-style interfaces with built-in presets and custom colors',
  },
  link: {
    name: 'link',
    title: 'Link',
    description: 'Clickable terminal links using OSC 8 escape sequences',
  },
  'mac-window': {
    name: 'mac-window',
    title: 'Mac Window',
    description: 'A macOS-style window component with traffic light buttons',
  },
  'multi-select': {
    name: 'multi-select',
    title: 'Multi Select',
    description: 'A multi-select input component with keyboard navigation',
  },

  'select-input': {
    name: 'select-input',
    title: 'Select Input',
    description: 'A select input component with keyboard navigation',
  },
  spinner: {
    name: 'spinner',
    title: 'Spinner',
    description: 'An animated loading spinner with customizable text',
  },
  table: {
    name: 'table',
    title: 'Table',
    description: 'A table component for displaying tabular data with customizable styling',
  },
  'text-input': {
    name: 'text-input',
    title: 'Text Input',
    description: 'A text input component with cursor and placeholder support',
  },
}

interface RegistryItem {
  $schema: string
  name: string
  type: string
  title: string
  description: string
  dependencies?: string[]
  devDependencies?: string[]
  files: {
    path: string
    type: string
    target: string
    content: string
  }[]
}

interface RegistryIndex {
  $schema: string
  name: string
  homepage: string
  items: {
    name: string
    type: string
    title: string
    description: string
    files: {
      path: string
      type: string
      target: string
    }[]
  }[]
}

async function getComponentDirs(): Promise<string[]> {
  const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true })
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => COMPONENT_CONFIGS[name]) // Only include configured components
}

async function readComponentSource(componentName: string): Promise<string> {
  const filePath = join(COMPONENTS_DIR, componentName, `${componentName}.tsx`)
  return readFile(filePath, 'utf-8')
}

async function buildComponentRegistry(componentName: string): Promise<RegistryItem> {
  const config = COMPONENT_CONFIGS[componentName]!
  const source = await readComponentSource(componentName)

  const item: RegistryItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: config.name,
    type: 'registry:ui',
    title: config.title,
    description: config.description,
    files: [
      {
        path: `ui/${componentName}.tsx`,
        type: 'registry:ui',
        target: `components/ui/${componentName}.tsx`,
        content: source,
      },
    ],
  }

  if (config.dependencies?.length) {
    item.dependencies = config.dependencies
  }

  if (config.devDependencies?.length) {
    item.devDependencies = config.devDependencies
  }

  return item
}

async function buildRegistryIndex(components: string[]): Promise<RegistryIndex> {
  const items = components.map(name => {
    const config = COMPONENT_CONFIGS[name]!
    return {
      name: config.name,
      type: 'registry:ui',
      title: config.title,
      description: config.description,
      files: [
        {
          path: `registry/ui/${name}.tsx`,
          type: 'registry:ui',
          target: `components/ui/${name}.tsx`,
        },
      ],
    }
  })

  return {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'ink-ui',
    homepage: 'https://github.com/cjroth/ink-web',
    items,
  }
}

async function main() {
  console.log('Building ink-ui registry...\n')

  // Ensure registry directory exists
  await mkdir(REGISTRY_DIR, { recursive: true })
  await mkdir(join(REGISTRY_DIR, 'ui'), { recursive: true })

  // Get all component directories
  const components = await getComponentDirs()
  console.log(`Found ${components.length} components: ${components.join(', ')}\n`)

  // Build individual component registry files
  for (const componentName of components) {
    try {
      const registry = await buildComponentRegistry(componentName)
      const filePath = join(REGISTRY_DIR, `${componentName}.json`)
      await writeFile(filePath, JSON.stringify(registry, null, 2) + '\n')
      console.log(`  Generated: registry/${componentName}.json`)

      // Also copy the source to registry/ui for the index to reference
      const source = await readComponentSource(componentName)
      const uiPath = join(REGISTRY_DIR, 'ui', `${componentName}.tsx`)
      await writeFile(uiPath, source)
    } catch (error) {
      console.error(`  Error building ${componentName}:`, error)
    }
  }

  // Build the main registry index
  const registryIndex = await buildRegistryIndex(components)
  const indexPath = join(REGISTRY_DIR, '..', 'registry.json')
  await writeFile(indexPath, JSON.stringify(registryIndex, null, 2) + '\n')
  console.log(`\n  Generated: registry.json`)

  console.log('\nRegistry build complete!')
}

main().catch(console.error)
