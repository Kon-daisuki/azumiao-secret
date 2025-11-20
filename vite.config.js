import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
    // 👇 这里必须和你的仓库名 azumiao-secret 一致
      base: '/azumiao-secret/', 
      })