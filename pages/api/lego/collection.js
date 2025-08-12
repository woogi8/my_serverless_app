import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching LEGO collection data...')
      
      const { data, error } = await supabase
        .from('my_lego_list')
        .select('*')
        .order('id', { ascending: true })

      console.log('Supabase query result:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ 
          success: false, 
          message: 'Database error', 
          error: error.message 
        })
      }

      return res.status(200).json({
        success: true,
        data: data || [],
        count: data?.length || 0
      })

    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error', 
        error: error.message 
      })
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
    method: req.method,
    allowed: ['GET']
  })
}