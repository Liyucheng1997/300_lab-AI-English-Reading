import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { claudeApi } from './server/claudeApi.js'

export default defineConfig({
  base: './',
  plugins: [react(), claudeApi()],
  server: { port: Number(process.env.PORT) || 5301, strictPort: false },
})
