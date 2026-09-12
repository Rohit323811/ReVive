import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './store/auth'
import { RevivalsProvider } from './store/revivals'
import AppShell from './components/AppShell'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Results from './pages/Results'
import Project from './pages/Project'
import Revivals from './pages/Revivals'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Account from './pages/Account'
import ObjectDetail from './pages/ObjectDetail'

export default function App() {
  return (
    <AuthProvider>
      <RevivalsProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/result" element={<Results />} />
            <Route path="/project/:objectId/:ideaId" element={<Project />} />
            <Route path="/revivals" element={<Revivals />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path="/object/:objectId" element={<ObjectDetail />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </RevivalsProvider>
    </AuthProvider>
  )
}
