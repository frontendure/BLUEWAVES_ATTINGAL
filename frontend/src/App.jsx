import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import AnnouncementBanner from './components/AnnouncementBanner'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const Programs = lazy(() => import('./pages/Programs'))
const Membership = lazy(() => import('./pages/Membership'))
const Gallery = lazy(() => import('./pages/Gallery'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

function RouteLoader({ fullscreen = false }) {
  return (
    <div className={`route-loader${fullscreen ? ' fullscreen' : ''}`}>
      <div className="loader" />
      <p>Loading...</p>
    </div>
  )
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="site-main">
        <Suspense fallback={<RouteLoader />}>
          <PageTransition>{children}</PageTransition>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      {location.pathname === '/' && <AnnouncementBanner key="home-banner" />}
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/programs" element={<Layout><Programs /></Layout>} />
        <Route path="/membership" element={<Layout><Membership /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/admin" element={<Suspense fallback={<RouteLoader fullscreen />}><AdminLogin /></Suspense>} />
        <Route path="/admin/dashboard" element={<Suspense fallback={<RouteLoader fullscreen />}><AdminDashboard /></Suspense>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </>
  )
}
