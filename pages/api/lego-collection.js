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
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('=== Environment Check ===')
    console.log('URL exists:', !!supabaseUrl)
    console.log('Key exists:', !!supabaseKey)
    console.log('URL value:', supabaseUrl)
    console.log('Key length:', supabaseKey?.length)

    // 환경 변수 검증
    if (!supabaseUrl || !supabaseKey) {
      console.log('Environment variables missing')
      return res.status(500).json({
        success: false,
        message: 'Supabase configuration missing',
        error: 'Environment variables NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required',
        timestamp: new Date().toISOString()
      })
    }

    // Supabase 동적 import (서버리스 환경에서 더 안정적)
    const { createClient } = await import('@supabase/supabase-js')
    
    console.log('Creating Supabase client...')
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('Querying my_lego_list table...')
    
    // my_lego_list 테이블에서 모든 데이터 조회 시도
    let data, error
    
    try {
      const result = await supabase
        .from('my_lego_list')
        .select('*')
        .order('id', { ascending: true })
      
      data = result.data
      error = result.error
      
      console.log('Query result:', { 
        dataCount: data?.length, 
        hasError: !!error,
        errorMessage: error?.message 
      })
      
    } catch (queryError) {
      console.error('Network/Query error:', queryError)
      
      // 네트워크 연결 실패 시 에러 반환
      return res.status(500).json({
        success: false,
        message: 'Failed to connect to Supabase',
        error: queryError.message,
        timestamp: new Date().toISOString()
      })
    }

    if (error) {
      console.error('Supabase query error:', error)
      
      // 데이터베이스 쿼리 오류 시 에러 반환
      return res.status(500).json({
        success: false,
        message: 'Database query failed',
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      })
    }

    return res.status(200).json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString(),
      source: 'my_lego_list table from Supabase'
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
  }
}