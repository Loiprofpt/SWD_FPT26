import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Thay thế CLIENT_ID của bạn vào đây */}
    <GoogleOAuthProvider clientId="255684598312-6ru63eb752a0lv6kjn397d1f8oh769lj.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
