import { useState } from 'react'

export default function Sidebar({ user, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', href: '/' },
    { icon: '🧱', label: '레고 소장품', href: '/lego-collection' },
    { icon: '👤', label: 'Profile', href: '/profile' },
    { icon: '📊', label: 'Analytics', href: '/analytics' },
    { icon: '⚙️', label: 'Settings', href: '/settings' },
    { icon: '📁', label: 'Projects', href: '/projects' },
    { icon: '📝', label: 'Tasks', href: '/tasks' },
    { icon: '💬', label: 'Messages', href: '/messages' },
    { icon: '🔔', label: 'Notifications', href: '/notifications' },
  ]

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1001,
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem',
          cursor: 'pointer',
          fontSize: '1.2rem',
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: 'none'
          }}
          className="mobile-overlay"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          left: isMobileOpen ? 0 : isCollapsed ? '-200px' : 0,
          top: 0,
          height: '100vh',
          width: isCollapsed ? '80px' : '250px',
          backgroundColor: '#2d3748',
          color: 'white',
          transition: 'all 0.3s ease',
          zIndex: 999,
          overflowY: 'auto',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        }}
        className="sidebar"
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 1rem',
          borderBottom: '1px solid #4a5568',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!isCollapsed && (
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                VIBECODE
              </h2>
              <p style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: '#a0aec0'
              }}>
                Welcome, {user?.user_id}
              </p>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#a0aec0',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0.25rem'
            }}
            className="desktop-only"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '1rem 0' }}>
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                color: '#e2e8f0',
                textDecoration: 'none',
                transition: 'all 0.2s',
                borderLeft: '3px solid transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#4a5568'
                e.target.style.borderLeftColor = '#667eea'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.borderLeftColor = 'transparent'
              }}
              onClick={(e) => {
                e.preventDefault()
                window.location.href = item.href
              }}
            >
              <span style={{
                fontSize: '1.25rem',
                marginRight: isCollapsed ? 0 : '0.75rem',
                minWidth: '1.5rem',
                textAlign: 'center'
              }}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
              )}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          borderTop: '1px solid #4a5568'
        }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              padding: '0.75rem',
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c53030'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e53e3e'}
          >
            <span style={{
              fontSize: '1.25rem',
              marginRight: isCollapsed ? 0 : '0.5rem'
            }}>
              🚪
            </span>
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-overlay {
            display: block !important;
          }
          .sidebar {
            left: ${isMobileOpen ? 0 : '-250px'} !important;
            width: 250px !important;
          }
          .desktop-only {
            display: none !important;
          }
        }
        
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: #2d3748;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 3px;
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #667eea;
        }
      `}</style>
    </>
  )
}