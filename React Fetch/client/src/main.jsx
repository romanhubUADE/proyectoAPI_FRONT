import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './styles/reset.css'
import './styles/index.css'

import App from './App.jsx'
import { ShopProvider } from './context/ShopContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { RoleProvider } from './auth/RoleContext.jsx'  // ← agregado

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <RoleProvider>       {/* ← nuevo provider */}
            <App />
          </RoleProvider>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)