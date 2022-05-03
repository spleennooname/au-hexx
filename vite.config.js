// vite.config.js

import { defineConfig } from 'vite'

import glsl from 'vite-plugin-glsl'
import obfuscator from 'rollup-plugin-obfuscator';

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
          plugins: [
            obfuscator({
              globalOptions: {
                // Your javascript-obfuscator options here
                // Will be applied on the whole bundle. Set to `false` to disable
                // See what's allowed: https://github.com/javascript-obfuscator/javascript-obfuscator
              }
            })
          ]
        }
      }
    }
  }
})
