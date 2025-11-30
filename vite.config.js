import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// yahan base me /REPO-NAME/ lagana zaroori hai
export default defineConfig({
  base: '/birthday-mission/',   // <<-- yahan apne repo ka naam
  plugins: [react()],
})
