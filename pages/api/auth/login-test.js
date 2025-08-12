export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { user_id, user_pw } = req.body

  if (!user_id || !user_pw) {
    return res.status(400).json({ message: 'User ID and password are required' })
  }

  // 임시 테스트용 하드코딩된 로그인
  if (user_id === 'woogi' && user_pw === '1234') {
    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: {
        user_id: user_id
      }
    })
  }

  return res.status(401).json({ message: 'Invalid credentials' })
}