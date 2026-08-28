// D:\finalproject\shopsmart-frontend\src\main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Silence external browser extension errors and unhandled CDN rejections
window.addEventListener('error', (event) => {
  if (
    (event.filename && (event.filename.includes('share-modal.js') || event.filename.includes('stripe.com'))) ||
    (event.message && event.message.includes('addEventListener'))
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && String(event.reason).includes('Failed to load Stripe.js')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)