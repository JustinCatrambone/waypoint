import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: false
      },
      onwarn: (warning, handler) => {
        // Ignore specific warnings
        if (warning.code === 'a11y-no-static-element-interactions') return;
        // Handle all other warnings normally
        handler(warning);
      },
    })
  ],
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    port: 8080
  }
})