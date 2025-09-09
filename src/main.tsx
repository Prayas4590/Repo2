import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress noisy dev-only 'Failed to fetch' errors coming from HMR or third-party scripts
if (import.meta.env.DEV) {
  window.addEventListener('error', (event) => {
    try {
      const msg = (event as ErrorEvent).message || '';
      const src = (event as ErrorEvent).filename || '';
      if (msg.includes('Failed to fetch') && (src.includes('@vite') || src.includes('fullstory') || src.includes('fs.js'))) {
        event.preventDefault();
      }
    } catch {}
  });

  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = (event as PromiseRejectionEvent).reason;
      const str = typeof reason === 'string' ? reason : reason?.message || '';
      if (str && str.toString().includes('Failed to fetch')) {
        event.preventDefault();
      }
    } catch {}
  });
}

createRoot(document.getElementById("root")!).render(<App />);
