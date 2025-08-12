export default function handler(req, res) {
  console.log('=== TEST API ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  return res.status(200).json({
    message: 'Test API is working!',
    method: req.method,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}