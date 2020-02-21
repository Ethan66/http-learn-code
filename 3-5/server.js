const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
  console.log('request come: ', request.url)
  const etag = request.headers['if-none-match']
  if (etag === '777') {
    response.writeHead(304, {
      'Content-Type': 'text/html',
      'Cache-Control': 'max-age=20000, no-cache', // no-cache:会发送请求，让服务端判断是否要拿缓存
      'Last-Modified': '123', // 上一次修改时间
      'Etag': '777' // 数据签名：唯一标识符
    })
    response.end('123')
  } else {
    const html = fs.readFileSync('index.html')
    response.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'max-age=20000, no-cache',
      'Last-Modified': '123',
      'Etag': '777'
    })
    response.end(html)
  }
}).listen(8888)

console.log('server listening on 8888')