import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ExtendedScrollProvider } from '@scroll/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExtendedScrollProvider>
      <App />
    </ExtendedScrollProvider>
  </React.StrictMode>,
)
