import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'

function App() {
  return (
    <Routes>
      {/* Parent route renders AppLayout; child routes fill its <Outlet /> */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
      </Route>
    </Routes>
  )
}

export default App