import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/uploader/', 
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
