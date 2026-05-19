import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
  const location = useLocation()

  return (
    <div className="page-transition-shell">
      <div key={location.pathname} className="page-transition-content">
        {children}
      </div>
    </div>
  )
}
