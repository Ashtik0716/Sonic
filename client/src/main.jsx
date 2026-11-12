import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LikesProvider } from './context/LikesContext.jsx'
import { PlaylistsProvider } from './context/PlaylistContext.jsx'
import ErrorBoundary from './components/layout/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <LikesProvider>
          <PlaylistsProvider>
            <PlayerProvider>
              <App />
            </PlayerProvider>
          </PlaylistsProvider>
        </LikesProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)