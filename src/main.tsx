import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './styles/report.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('لم يُعثر على عنصر الجذر #root')

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
