import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm', 'cjs'],
  dts: { tsconfig: 'tsconfig.build.json' },
  clean: true,
  sourcemap: true,
  target: 'es2020',
  platform: 'node',
  external: ['ink', 'react', 'ink-testing-library', 'strip-ansi'],
})
