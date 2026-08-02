
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import { initSentry } from './services/sentry';
import { initPostHog } from './services/analytics';
import { registerServiceWorker } from './src/pwa/registerSW';
// Initialise i18next before any component renders so that the very first
// paint already speaks the correct language.
import './i18n/config';
import { bootstrapGeoLanguage } from './i18n/geoBootstrap';
import './src/index.css';

initSentry();
initPostHog();
registerServiceWorker();
// IP-based language auto-detect (only fires when the user has no explicit
// preference). Async; never blocks first paint. See i18n/geoBootstrap.ts.
bootstrapGeoLanguage();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <Analytics />
    </HelmetProvider>
  </React.StrictMode>
);
