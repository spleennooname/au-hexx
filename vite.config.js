// vite.config.js

import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig(({ command, mode }) => {
  return {
    server: {
      https: true
    },
    plugins: [
      glsl()
    ],
    build: {
      // cssCodeSplit: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: {
          index: './index.html'
        },
        output: {
          /* manualChunks: {
            three: [ "three" ],
            meyda: [ "meyda" ],
            rxjs: [ "rxjs" ]
          } */
        }
      }
    }
  }
})
