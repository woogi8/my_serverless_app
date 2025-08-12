export default async function handler(req, res) {
  // 간단한 응답부터 테스트
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Login API is working!',
      method: req.method,
      timestamp: new Date().toISOString()
    })
  }
  
  if (req.method === 'POST') {
    const { user_id, user_pw } = req.body || {}
    
    // 하드코딩된 테스트 로그인
    if (user_id === 'woogi' && user_pw === '1234') {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { user_id: 'woogi' }
      })
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Try woogi/1234'
    })
  }
  
  // 다른 메소드들
  return res.status(405).json({
    message: 'Method not allowed',
    method: req.method,
    allowed: ['GET', 'POST']
  })
}