import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../components/Sidebar'

export default function LegoCollection() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [legoData, setLegoData] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
      fetchLegoData()
    } else {
      router.push('/login')
    }
    setLoading(false)
  }, [router])

  const fetchLegoData = async () => {
    setDataLoading(true)
    setError('')
    
    try {
      console.log('Fetching data from /api/lego-collection...')
      const response = await fetch('/api/lego-collection')
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      const responseText = await response.text()
      console.log('Raw response:', responseText)

      // HTML 응답인지 확인
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        setError(`API returned HTML instead of JSON. Status: ${response.status}`)
        return
      }

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        setError(`JSON parsing error: ${parseError.message}`)
        console.error('JSON parse error:', parseError)
        return
      }

      if (response.ok && result.success) {
        setLegoData(result.data || [])
        console.log('Data loaded successfully:', result.data?.length, 'items')
      } else {
        setError(result.message || `API Error: ${response.status}`)
      }
    } catch (err) {
      setError(`Network error: ${err.message}`)
      console.error('Error fetching LEGO data:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      display: 'flex'
    }}>
      <Sidebar user={user} onLogout={handleLogout} />
      
      {/* Main Content */}
      <div style={{
        marginLeft: '250px',
        flex: 1,
        padding: '2rem',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}
      className="main-content"
      >
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '2rem',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <h1 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              🧱 레고 소장품
            </h1>
            <p style={{
              margin: 0,
              fontSize: '1.1rem',
              opacity: 0.9
            }}>
              내 레고 컬렉션을 확인하세요
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: '2rem' }}>
            {/* Status Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span style={{ fontSize: '1rem', color: '#4a5568' }}>
                  총 {legoData.length}개의 세트
                </span>
                {dataLoading && (
                  <span style={{ color: '#667eea', fontSize: '0.9rem' }}>
                    🔄 로딩 중...
                  </span>
                )}
              </div>
              <button
                onClick={fetchLegoData}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                disabled={dataLoading}
              >
                🔄 새로고침
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fed7d7',
                color: '#9b2c2c',
                borderRadius: '8px',
                marginBottom: '2rem',
                border: '1px solid #feb2b2'
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Table */}
            <div style={{
              overflowX: 'auto',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.95rem'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f7fafc',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    {legoData.length > 0 && Object.keys(legoData[0]).map((header, index) => (
                      <th key={index} style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#2d3748',
                        borderRight: index < Object.keys(legoData[0]).length - 1 ? '1px solid #e2e8f0' : 'none'
                      }}>
                        {header.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataLoading ? (
                    <tr>
                      <td 
                        colSpan={legoData.length > 0 ? Object.keys(legoData[0]).length : 1}
                        style={{
                          padding: '3rem',
                          textAlign: 'center',
                          color: '#718096'
                        }}
                      >
                        데이터를 불러오는 중...
                      </td>
                    </tr>
                  ) : legoData.length === 0 ? (
                    <tr>
                      <td 
                        colSpan="10"
                        style={{
                          padding: '3rem',
                          textAlign: 'center',
                          color: '#718096'
                        }}
                      >
                        소장품 데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    legoData.map((row, rowIndex) => (
                      <tr 
                        key={rowIndex}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f9fafb'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? 'white' : '#f9fafb'}
                      >
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex} style={{
                            padding: '1rem',
                            borderRight: cellIndex < Object.values(row).length - 1 ? '1px solid #e2e8f0' : 'none',
                            color: '#4a5568'
                          }}>
                            {cell !== null ? String(cell) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Info */}
            {legoData.length > 0 && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#718096',
                textAlign: 'center'
              }}>
                📊 총 {legoData.length}개의 레고 세트가 표시되고 있습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            padding: 1rem !important;
            padding-top: 4rem !important;
          }
        }
        
        table {
          font-size: 0.9rem;
        }
        
        @media (max-width: 640px) {
          table {
            font-size: 0.8rem;
          }
          
          th, td {
            padding: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}