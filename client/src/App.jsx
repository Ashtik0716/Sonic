import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import Album from './pages/Album'
import Artist from './pages/Artist'
import Auth from './pages/Auth'
import ProtectedRoute from './components/layout/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Parent route renders AppLayout; child routes fill its <Outlet /> */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/library" element={<Library />} />
          <Route path="/library/*" element={<Library />} />
        </Route>
        <Route path="/library/*" element={<Library />} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/artist/:id" element={<Artist />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Route>
    </Routes>
  )
}

export default App