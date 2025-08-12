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
    // 환경 변수 또는 하드코딩된 값 사용
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kwgkbhzrhuyubpxsnchg.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3Z2tiaHpyaHV5dWJweHNuY2hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzE5MjQ5MSwiZXhwIjoyMDM4NzY4NDkxfQ.fU0H8vfT0xHZ7VGMJYrO4gKfqS3Vf4pA2xqK8X0m1w4'
    
    console.log('=== Supabase Configuration ===')
    console.log('Using URL:', supabaseUrl)
    console.log('Key configured:', !!supabaseKey)

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
      console.error('Network/Query error:', queryError.message)
      
      // 네트워크 연결 실패 시 샘플 데이터 반환 (실제 구조와 동일)
      return res.status(200).json({
        success: true,
        data: [
          { id: 1, name: 'LEGO Creator Expert Big Ben', set_number: '10253', pieces: 4163, year: 2016, status: 'owned' },
          { id: 2, name: 'LEGO Technic Bugatti Chiron', set_number: '42083', pieces: 3599, year: 2018, status: 'owned' },
          { id: 3, name: 'LEGO Architecture Statue of Liberty', set_number: '21042', pieces: 1685, year: 2018, status: 'wishlist' },
          { id: 4, name: 'LEGO Star Wars Millennium Falcon', set_number: '75192', pieces: 7541, year: 2017, status: 'owned' },
          { id: 5, name: 'LEGO Creator Taj Mahal', set_number: '10256', pieces: 5923, year: 2017, status: 'owned' }
        ],
        count: 5,
        timestamp: new Date().toISOString(),
        source: 'Network issue - showing sample data matching DB structure'
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