import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Environment check:', {
  url: supabaseUrl,
  keyLength: supabaseKey?.length,
  nodeVersion: process.version
})

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

export default async function handler(req, res) {
  // 요청 로깅
  console.log('=== API REQUEST ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)
  
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled')
    return res.status(200).end()
  }

  // GET 요청도 허용 (테스트용)
  if (req.method === 'GET') {
    console.log('GET request received')
    return res.status(200).json({ message: 'Login API is working', method: 'GET' })
  }

  // POST 메소드 처리
  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method)
    return res.status(405).json({ 
      message: `Method ${req.method} not allowed. Use POST.`,
      receivedMethod: req.method,
      allowedMethods: ['POST', 'GET', 'OPTIONS']
    })
  }

  const { user_id, user_pw } = req.body

  if (!user_id || !user_pw) {
    return res.status(400).json({ message: 'User ID and password are required' })
  }

  try {
    console.log('Login attempt:', { user_id, user_pw: '***' })
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    const { data, error } = await supabase
      .from('lego_user')
      .select('*')
      .eq('user_id', user_id)
      .eq('user_pw', user_pw)

    console.log('Supabase query result:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ message: 'Database error', error: error.message })
    }

    if (!data || data.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const userData = Array.isArray(data) ? data[0] : data

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: {
        user_id: userData.user_id
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}