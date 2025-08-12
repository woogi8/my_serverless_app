import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed',
      method: req.method 
    })
  }

  try {
    console.log('=== LEGO Collection API ===')
    console.log('Supabase URL:', supabaseUrl)
    console.log('Service Key Length:', supabaseKey?.length)
    
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('Fetching data from my_lego_list table...')
    
    // my_lego_list 테이블에서 모든 데이터 조회
    const { data, error } = await supabase
      .from('my_lego_list')
      .select('*')
      .order('id', { ascending: true })

    console.log('Supabase response:', { 
      dataCount: data?.length, 
      error: error?.message 
    })

    if (error) {
      console.error('Supabase error details:', error)
      return res.status(500).json({
        success: false,
        message: 'Database query failed',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }

    return res.status(200).json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString(),
      source: 'my_lego_list table'
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}