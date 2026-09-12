import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA / WebAPK offline support and automatic OTA updates
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
      console.log(`[Biophar PWA] Service Worker registered: ${swUrl}`, r);
    },
    onRegisterError(error) {
      console.error('[Biophar PWA] Service Worker registration failed', error);
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
