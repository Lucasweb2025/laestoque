import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  // demo: caminhos relativos para abrir dist/index.html pelo Explorer
  base: mode === 'demo' ? './' : '/',
}))
