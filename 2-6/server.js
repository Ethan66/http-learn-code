const http = require('http')

http.createServer((request, response) => {
  console.log(request)
  response.end('123') // 返回
}).listen(8888)

console.log('server listen to 8888')