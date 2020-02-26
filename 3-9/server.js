const http = require('http')

http.createServer((request, response) => {
  console.log('requset come:', request.url)
  if (request.url === '/') {
    response.writeHead(302, {
      'location': '/new'
    })
    response.end()
  } else {
    if (request.url === '/new') {
      response.writeHead(200)
      response.end('123')
    }
  }
}).listen(8888)

console.log('server listening on 8888')