export default async function handler(req, res) {
  // 테스트용 간단한 응답부터
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: [
        { id: 1, name: 'LEGO Creator Expert Big Ben', set_number: '10253', pieces: 4163, year: 2016 },
        { id: 2, name: 'LEGO Technic Bugatti Chiron', set_number: '42083', pieces: 3599, year: 2018 },
        { id: 3, name: 'LEGO Architecture Statue of Liberty', set_number: '21042', pieces: 1685, year: 2018 },
        { id: 4, name: 'LEGO Star Wars Millennium Falcon', set_number: '75192', pieces: 7541, year: 2017 },
        { id: 5, name: 'LEGO Creator Taj Mahal', set_number: '10256', pieces: 5923, year: 2017 }
      ],
      count: 5,
      message: 'Test data - Supabase connection will be restored after testing'
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
    method: req.method,
    allowed: ['GET']
  })
}