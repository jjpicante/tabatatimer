import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { createRoot } from 'react-dom/client';



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <App />
  </Provider>
);
reportWebVitals();