// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Use @ alias for all imports
import { App } from '@/App'; // Ensure correct path/extension if needed
import { queryClient } from '@/lib/queryClient.ts'; // Ensure correct path/extension
import '@/lib/i18n.ts'; // Initialize i18n, ensure correct path/extension
import '@/styles/index.css'; // Import global styles, ensure correct path/extension

// --- 1. COMMENT OUT the enableMocking function ---
/*
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  // Use @ alias here too
  const { worker } = await import('@/mocks/browser'); // Ensure correct path/extension if needed
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
*/
// --- END COMMENT OUT ---

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element with id 'root'");
}

// --- 2. RENDER DIRECTLY (Removed enableMocking().then()) ---
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
// --- END RENDER UPDATE ---