import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { grokProxyPlugin } from './vite.grok-proxy'

export default defineConfig({
  plugins: [react(), grokProxyPlugin()],
  css: {
    modules: {
      // Allow camelCase access (s.objHero) for kebab-case class names (.obj-hero)
      localsConvention: 'camelCaseOnly',
    },
  },
  server: { port: 5173, host: true },
})
