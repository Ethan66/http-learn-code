const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
  if (request.url === '/') {
    const html = fs.readFileSync('index.html')
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end(html)
  } else {
    response.end('123')
  }
}).listen(8888)

console.log('server listening on 8888')