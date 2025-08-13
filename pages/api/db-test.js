export default async function handler(req, res) {
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  }

  // 1. 환경 변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kwgkbhzrhuyubpxsnchg.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3Z2tiaHpyaHV5dWJweHNuY2hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzE5MjQ5MSwiZXhwIjoyMDM4NzY4NDkxfQ.fU0H8vfT0xHZ7VGMJYrO4gKfqS3Vf4pA2xqK8X0m1w4'
  
  results.tests.push({
    test: 'Environment Variables',
    status: 'pass',
    details: {
      url: supabaseUrl,
      keyLength: supabaseKey?.length,
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    }
  })

  // 2. 기본 fetch 테스트
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    results.tests.push({
      test: 'Basic Supabase API Access',
      status: response.ok ? 'pass' : 'fail',
      details: {
        status: response.status,
        statusText: response.statusText,
        url: `${supabaseUrl}/rest/v1/`
      }
    })
  } catch (error) {
    results.tests.push({
      test: 'Basic Supabase API Access',
      status: 'fail',
      error: error.message,
      details: {
        errorType: error.constructor.name,
        url: `${supabaseUrl}/rest/v1/`
      }
    })
  }

  // 3. Supabase 클라이언트 테스트
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    results.tests.push({
      test: 'Supabase Client Creation',
      status: 'pass',
      details: {
        clientCreated: true
      }
    })

    // 4. 테이블 스키마 조회
    try {
      const { data, error } = await supabase
        .from('my_lego_list')
        .select('*')
        .limit(1)

      results.tests.push({
        test: 'my_lego_list Table Query',
        status: error ? 'fail' : 'pass',
        details: {
          hasError: !!error,
          errorMessage: error?.message,
          dataReceived: !!data,
          dataLength: data?.length
        },
        error: error?.message
      })
    } catch (queryError) {
      results.tests.push({
        test: 'my_lego_list Table Query',
        status: 'fail',
        error: queryError.message,
        details: {
          errorType: queryError.constructor.name
        }
      })
    }

  } catch (clientError) {
    results.tests.push({
      test: 'Supabase Client Creation',
      status: 'fail',
      error: clientError.message,
      details: {
        errorType: clientError.constructor.name
      }
    })
  }

  // 5. DNS 해결 테스트
  try {
    const dns = require('dns').promises
    const hostname = new URL(supabaseUrl).hostname
    const addresses = await dns.resolve4(hostname)
    
    results.tests.push({
      test: 'DNS Resolution',
      status: 'pass',
      details: {
        hostname,
        addresses
      }
    })
  } catch (dnsError) {
    results.tests.push({
      test: 'DNS Resolution',
      status: 'fail',
      error: dnsError.message,
      details: {
        hostname: new URL(supabaseUrl).hostname
      }
    })
  }

  // 결과 요약
  const passedTests = results.tests.filter(t => t.status === 'pass').length
  const totalTests = results.tests.length
  
  results.summary = {
    total: totalTests,
    passed: passedTests,
    failed: totalTests - passedTests,
    overallStatus: passedTests === totalTests ? 'all_pass' : 'some_fail'
  }

  res.status(200).json(results)
}