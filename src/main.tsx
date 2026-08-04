import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// service worker: la app queda instalable y funciona sin conexión.
// Sin esto, una pestaña abierta desde antes de un despliegue puede quedarse
// sirviendo JS viejo indefinidamente (el SW nuevo se descarga en segundo
// plano pero no toma control hasta que se le pide explícitamente) — updateSW(true)
// fuerza el skipWaiting + recarga en cuanto hay una versión nueva disponible,
// para no arrastrar bugs ya corregidos.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
