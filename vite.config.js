// vite.config.js

import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      glsl({
        warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
        compress: false // the resulting shader code
      })
    ]
  }
})
