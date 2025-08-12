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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
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