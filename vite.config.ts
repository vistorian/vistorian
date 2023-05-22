import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://shuxinhuan.github.io/vistorian2.0_dev',
  plugins: [react()],
})
