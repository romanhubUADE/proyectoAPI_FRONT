// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './styles/reset.css';
import './styles/index.css';

import App from './App.jsx';
import { ShopProvider } from './context/ShopContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { RoleProvider } from './auth/RoleContext.jsx';
import { store } from './redux/store.js';
import { fetchMe } from './redux/authSlice.js';

// Auto-login: si hay token en Redux, llamar a /me
const token = store.getState().auth.token;
if (token) {
  store.dispatch(fetchMe());
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <ShopProvider>
            <RoleProvider>
              <App />
            </RoleProvider>
          </ShopProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);