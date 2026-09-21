import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function withTrailingSlash(path) {
  const p = (path || '/').trim() || '/'
  return p.endsWith('/') ? p : `${p}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isVercel = Boolean(process.env.VERCEL)
  const defaultBase = isVercel ? '/' : '/bhg-patientportal/'
  const base = withTrailingSlash(env.VITE_BASE_PATH || defaultBase)

  return {
    plugins: [react()],
    base,

    server: {
      port: 5174,
      open: true,
    },
    preview: {
      allowedHosts: true,   
     },
  }
})
