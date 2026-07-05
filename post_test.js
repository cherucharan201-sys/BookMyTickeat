const http = require('http')
const data = JSON.stringify({name:'CLI Test', email:'clitest@example.com', password:'TestPass123'})
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode)
  console.log('HEADERS:', res.headers)
  let body = ''
  res.on('data', (chunk) => { body += chunk })
  res.on('end', () => { console.log('BODY:', body) })
})

req.on('error', (e) => { console.error('ERROR:', e) })
req.write(data)
req.end()
