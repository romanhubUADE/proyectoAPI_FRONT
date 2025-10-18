import { StrictMode } from 'react'
import './styles/reset.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ShopProvider } from './context/ShopContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx';

import App from './App.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
)
