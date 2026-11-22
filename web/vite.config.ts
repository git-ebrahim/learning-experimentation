import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo at https://git-ebrahim.github.io/learning-experimentation/,
  // so built asset URLs must start with the repository name.
  base: '/learning-experimentation/',
})
