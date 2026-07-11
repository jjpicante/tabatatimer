import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(<App />);

// Registro del service worker para que la app sea instalable y funcione offline.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/service-worker.js`)
      .catch((err) => console.error('No se pudo registrar el service worker:', err));
  });
}

reportWebVitals();
