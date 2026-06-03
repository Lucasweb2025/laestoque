import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  // demo: pasta local | pages: GitHub Pages em /laestoque/
  base:
    mode === 'demo' ? './' : mode === 'pages' ? '/laestoque/' : '/',
}))
