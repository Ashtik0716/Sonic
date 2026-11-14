import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Album from './pages/Album'
import Artist from './pages/Artist'
import Auth from './pages/Auth'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LikedSongs from './pages/LikedSongs'
import Playlist from './pages/Playlist'
import Recent from './pages/Recent'
import NotFound from './pages/NotFound'
import Playlists from './pages/Playlists'

function App() {
  return (
    <Routes>
      {/* Parent route renders AppLayout; child routes fill its <Outlet /> */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/library" element={<Navigate to="/library/liked" replace />} />
          <Route path="/library/liked" element={<LikedSongs />} />
          <Route path="/library/playlists" element={<Playlists />} />
          <Route path="/library/recent" element={<Recent />} />
          <Route path="/library/*" element={<Navigate to="/library/liked" replace />} />
          <Route path="/playlist/:id" element={<Playlist />} />
        </Route>
        <Route path="/album/:id" element={<Album />} />
        <Route path="/artist/:id" element={<Artist />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App