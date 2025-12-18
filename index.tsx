import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const start = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    // Retry once if not found immediately (browser race condition)
    setTimeout(start, 50);
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
