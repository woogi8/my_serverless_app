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

    // 환경 변수 검증 - 없으면 폴백 데이터 반환
    if (!supabaseUrl || !supabaseKey) {
      console.log('Environment variables missing, using fallback data')
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
        source: 'Fallback data (Environment variables not configured)',
        warning: 'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables'
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
      
      // 네트워크 오류 시 폴백 데이터 반환
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
        source: 'Fallback data (Supabase connection failed)',
        warning: 'Using test data due to network connectivity issues'
      })
    }

    if (error) {
      console.error('Supabase query error:', error)
      
      // 데이터베이스 오류 시에도 폴백 데이터 반환
      return res.status(200).json({
        success: true,
        data: [
          { id: 1, name: 'LEGO Creator Expert Big Ben', set_number: '10253', pieces: 4163, year: 2016, status: 'owned' },
          { id: 2, name: 'LEGO Technic Bugatti Chiron', set_number: '42083', pieces: 3599, year: 2018, status: 'owned' }
        ],
        count: 2,
        timestamp: new Date().toISOString(),
        source: 'Fallback data (Database query failed)',
        error: error.message
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