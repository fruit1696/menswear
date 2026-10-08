import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
    envPrefix: ['VITE_', 'SUPABASE_', 'NEXT_PUBLIC_'],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    plugins: [
        react(),
    ]
});

